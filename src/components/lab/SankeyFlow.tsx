import { useMemo } from 'react'
import { ParentSize } from '@visx/responsive'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { motion } from 'framer-motion'
import { formatVnd } from '../../lib/currency'

interface FlowNode { name: string; color: string }
interface FlowLink { source: number; target: number; value: number }

interface Props {
  industrial: number
  merchant: number
  finance: number
  rent: number
  startingM: number
}

const COLORS = {
  m: '#06B6D4',
  p: '#3B82F6',
  pTN: '#10B981',
  Z: '#F59E0B',
  R: '#EC4899',
  keep: '#FAFAFA',
}

export default function SankeyFlow({ industrial, merchant, finance, rent, startingM }: Props) {
  const total = Math.max(industrial + merchant + finance + rent, startingM, 1)

  const data = useMemo(() => {
    const nodes: FlowNode[] = [
      { name: 'm (Tổng GTTT)', color: COLORS.m },
      { name: 'p (Lợi nhuận CN)', color: COLORS.p },
      { name: 'Lợi nhuận thương nghiệp', color: COLORS.pTN },
      { name: 'Z (Lãi tức)', color: COLORS.Z },
      { name: 'R (Địa tô)', color: COLORS.R },
    ]
    const safeFinance = Math.max(0, finance)
    const safeRent = Math.max(0, rent)
    const links: FlowLink[] = [
      { source: 0, target: 1, value: Math.max(industrial, 1) },
      { source: 0, target: 2, value: Math.max(merchant, 0.5) },
      { source: 0, target: 3, value: Math.max(safeFinance, 0.5) },
      { source: 0, target: 4, value: Math.max(safeRent, 0.5) },
    ].filter((l) => l.value > 0)
    return { nodes, links, total }
  }, [industrial, merchant, finance, rent, startingM, total])

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2 text-[var(--color-lab-cyan)]">SANKEY · m → p / LN thương nghiệp / Z / R</p>
      <h3 className="font-display text-xl font-bold mb-6">
        Giá trị thặng dư <span className="text-[var(--color-lab-cyan)]">m</span> được chia thế nào?
      </h3>

      <div className="w-full" style={{ minHeight: 320 }}>
        <ParentSize debounceTime={50}>
          {({ width }) => {
            if (width === 0) return null
            const height = Math.max(280, Math.min(width * 0.55, 380))
            const layout = sankey<FlowNode, FlowLink>()
              .nodeWidth(14)
              .nodePadding(20)
              .extent([[8, 16], [width - 8, height - 16]])
            const cloned = {
              nodes: data.nodes.map((n) => ({ ...n })),
              links: data.links.map((l) => ({ ...l })),
            }
            const graph = layout(cloned as never)

            return (
              <svg width={width} height={height} style={{ overflow: 'visible' }}>
                <g>
                  {graph.links.map((link, i) => {
                    const targetNode = graph.nodes[(link.target as { index: number }).index] as FlowNode & { x0?: number }
                    const d = sankeyLinkHorizontal()(link as never) ?? ''
                    return (
                      <motion.path
                        key={`link-${i}`}
                        d={d}
                        fill="none"
                        stroke={targetNode.color}
                        strokeOpacity={0.35}
                        strokeWidth={Math.max(1, link.width ?? 1)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                      />
                    )
                  })}
                </g>
                <g>
                  {graph.nodes.map((node, i) => {
                    const n = node as FlowNode & { x0: number; x1: number; y0: number; y1: number; value: number }
                    const isSource = i === 0
                    return (
                      <g key={`node-${i}`}>
                        <rect
                          x={n.x0}
                          y={n.y0}
                          width={n.x1 - n.x0}
                          height={Math.max(2, n.y1 - n.y0)}
                          fill={n.color}
                          rx={2}
                        />
                        <text
                          x={isSource ? n.x1 + 8 : n.x0 - 8}
                          y={(n.y0 + n.y1) / 2}
                          dy={4}
                          textAnchor={isSource ? 'start' : 'end'}
                          className="font-mono"
                          style={{
                            fill: n.color,
                            fontSize: width < 500 ? 10 : 12,
                            fontWeight: 700,
                          }}
                        >
                          {n.name}
                        </text>
                        <text
                          x={isSource ? n.x1 + 8 : n.x0 - 8}
                          y={(n.y0 + n.y1) / 2 + (width < 500 ? 14 : 18)}
                          textAnchor={isSource ? 'start' : 'end'}
                          className="font-mono"
                          style={{ fill: 'var(--color-lab-fg-dim)', fontSize: width < 500 ? 9 : 11 }}
                        >
                          {formatVnd(n.value ?? 0, true)}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>
            )
          }}
        </ParentSize>
      </div>

      <p className="lab-cite mt-4 text-center text-[var(--color-lab-fg-dim)]">
        Chiều rộng dải = tỷ lệ phần m chuyển vào mỗi tay
      </p>
    </div>
  )
}
