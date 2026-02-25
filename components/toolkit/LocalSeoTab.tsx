"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
        <div className="rounded-xl border border-border bg-card/80 p-4">
          {found && business ? (
            <pre className="overflow-auto text-sm text-card-foreground">
              {JSON.stringify(business, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No business listing found.</p>
          )}
        </div>
      )}
    </div>
  );
}
