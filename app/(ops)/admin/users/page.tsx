import { Card } from "@/components/Card";
import { MOCK_USERS } from "@/lib/mock-data";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Users</h1>

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {MOCK_USERS.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium text-brand-black">{user.name}</p>
                <p className="text-xs text-brand-gray">{user.email}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  user.role === "Admin"
                    ? "bg-brand-magenta text-white"
                    : user.role === "Ops Staff"
                      ? "bg-status-photographed/15 text-status-photographed"
                      : "bg-brand-grayPill text-brand-black"
                }`}
              >
                {user.role}
              </span>
              <span className="text-xs text-brand-gray">Joined {user.joined}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
