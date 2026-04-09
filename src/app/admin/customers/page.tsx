import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  try {
    await requireAuth();
  } catch {
    redirect("/admin/login");
  }

  const { search, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam || "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        jobs: { select: { id: true, status: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kunder</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} totalt</p>
        </div>
      </div>

      {/* Search */}
      <form className="mb-4">
        <div className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Sök namn, e-post, telefon..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Sök
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500">
            <div className="text-4xl mb-4">👥</div>
            <p className="font-medium">Inga kunder hittades</p>
            <p className="text-sm mt-1">Kunder läggs till manuellt eller konverteras från leads.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kund</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontakt</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Adress</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jobb</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedan</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{customer.phone}</div>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm max-w-[160px] truncate">
                      {customer.address}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{customer.jobs.length} jobb</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(customer.createdAt).toLocaleDateString("sv-SE")}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Visa →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Visar {skip + 1}–{Math.min(skip + limit, total)} av {total}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/customers?page=${page - 1}${search ? `&search=${search}` : ""}`} className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                ← Föregående
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/customers?page=${page + 1}${search ? `&search=${search}` : ""}`} className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                Nästa →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
