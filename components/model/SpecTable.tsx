import { Fragment } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import type { SpecGroup } from "@/data/model-details/types";

const cell = "border-b border-line px-6 py-3.5 text-left align-top";

/** Spec comparison table, grouped by category; scrolls sideways on phones. */
export function SpecTable({ columns, groups }: { columns: string[]; groups: SpecGroup[] }) {
  return (
    <Reveal>
      {/* Scroll lives on an inner box: the spotlight's border ring sits 1px outside the card and would add a scrollbar */}
      <GlassCard tone="strong" spotlight className="[--spot-size:600px]">
        <div className="overflow-x-auto rounded-[inherit]">
        <table className="relative w-full min-w-[640px] border-collapse text-[15px]">
          <thead>
            <tr>
              <th scope="col" className={`${cell} bg-glass-2`}>
                <span className="sr-only">Үзүүлэлт</span>
              </th>
              {columns.map((c) => (
                <th key={c} scope="col" className={`${cell} bg-glass-2 font-bold text-ink`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child>*]:border-b-0">
            {groups.map((group) => (
              <Fragment key={group.title}>
                <tr>
                  <th colSpan={columns.length + 1} scope="colgroup" className={`${cell} pt-[26px] text-xs font-semibold uppercase tracking-[0.16em] text-accent`}>
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className={`${cell} font-medium text-muted`}>
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={`${cell} text-ink`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </GlassCard>
    </Reveal>
  );
}
