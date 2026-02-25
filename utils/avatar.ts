export function getAvatarPlaceholder(email: string): string {
  const hash = email
    .toLowerCase()
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash % 8);
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
    "from-lime-500 to-green-600",
    "from-fuchsia-500 to-pink-600",
  ];
  return colors[index];
}

export function getInitials(email: string): string {
  const part = email.split("@")[0];
  if (part.length >= 2) {
    return (part[0] + part[1]).toUpperCase();
  }
  return part.slice(0, 2).toUpperCase();
}
