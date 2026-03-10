"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const CHART_COLORS = ["#22c55e", "#ef4444"];

export default function LocalSeoTab() {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<Record<string, unknown> | null>(null);
  const [found, setFound] = useState<boolean | null>(null);

  const handleCheck = async () => {
    if (!businessName.trim() || !location.trim()) {
      toast("Enter business name and location.", "error");
      return;
    }
    setLoading(true);
    setFound(null);
    setBusiness(null);
    try {
      const data = await api.localSeo.business(businessName.trim(), location.trim());
      setFound(data.found);
      setBusiness(data.business || null);
      toast(data.found ? "Business found." : "No listing found.", data.found ? "success" : "info");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Check failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Local SEO Toolkit</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business"
          disabled={loading}
        />
        <Input
          label="Location (City)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. New York"
          disabled={loading}
        />
      </div>
      <Button onClick={handleCheck} loading={loading}>
        Check Business Listing
      </Button>
      {found !== null && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <h4 className="mb-2 text-sm font-medium text-card-foreground">Listing status</h4>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[{ name: found ? "Found" : "Not found", value: 1, fill: found ? CHART_COLORS[0] : CHART_COLORS[1] }]}
                  layout="vertical"
                  margin={{ left: 48, right: 8, top: 8, bottom: 8 }}
                >
                  <XAxis type="number" domain={[0, 1]} hide />
                  <YAxis type="category" dataKey="name" width={48} tick={{ fill: "currentColor", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {found && business && (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              {(() => {
                const b = business as { rating?: number; user_ratings_total?: number };
                const hasMetrics = typeof b.rating === "number" || typeof b.user_ratings_total === "number";
                if (hasMetrics) {
                  const barData = [
                    ...(typeof b.rating === "number" ? [{ name: "Rating", value: b.rating, fill: "#6366f1" }] : []),
                    ...(typeof b.user_ratings_total === "number" ? [{ name: "Reviews", value: Math.min(b.user_ratings_total, 100), fill: "#8b5cf6" }] : []),
                  ];
                  return (
                    <>
                      <h4 className="mb-2 text-sm font-medium text-card-foreground">Business metrics</h4>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                            <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                            <YAxis tick={{ fill: "currentColor", fontSize: 12 }} domain={[0, typeof b.rating === "number" ? 5 : "auto"]} />
                            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(v, name) => [name === "Reviews" && typeof b.user_ratings_total === "number" ? b.user_ratings_total : v, name]} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {barData.map((d, i) => (
                                <Cell key={i} fill={d.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  );
                }
                return null;
              })()}
              <pre className="mt-4 overflow-auto text-sm text-card-foreground">
                {JSON.stringify(business, null, 2)}
              </pre>
            </div>
          )}
          {!found && (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <p className="text-muted-foreground">No business listing found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
