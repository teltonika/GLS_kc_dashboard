import { supabase } from './supabase'

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0m 0s'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
}

export function formatDurationShort(seconds: number): string {
  if (!seconds || seconds === 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatHoursMinutes(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${mins}m`
}

export function translateCallType(type: string): string {
  const map: Record<string, string> = {
    'Inbound': 'Dohodni',
    'Outbound': 'Odhodni',
    'Internal': 'Interni',
  }
  return map[type] || type
}

export function translateStatus(status: string): string {
  const map: Record<string, string> = {
    'ANSWERED': 'ODGOVORJEN',
    'NO ANSWER': 'NI ODGOVORA',
    'BUSY': 'ZASEDEN',
    'FAILED': 'NEUSPEŠEN',
  }
  return map[status] || 'ZAMUJEN'
}

function getDateRange(period: string): { start: string; end: string } {
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // If period is a date string (YYYY-MM-DD), use it directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    return {
      start: `${period}T00:00:00`,
      end: `${period}T23:59:59`
    }
  }

  switch (period) {
    case 'today':
      return { start: `${today}T00:00:00`, end: `${today}T23:59:59` }
    case 'yesterday':
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const yDate = yesterday.toISOString().split('T')[0]
      return { start: `${yDate}T00:00:00`, end: `${yDate}T23:59:59` }
    case 'last7days':
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { start: weekAgo.toISOString(), end: now.toISOString() }
    case 'last30days':
      const monthAgo = new Date(now)
      monthAgo.setDate(monthAgo.getDate() - 30)
      return { start: monthAgo.toISOString(), end: now.toISOString() }
    default:
      return { start: `${today}T00:00:00`, end: `${today}T23:59:59` }
  }
}

// ============================================
// PAGE 1: PREGLED (Overview)
// ============================================

export interface OverviewStats {
  skupajKlicev: number
  odgovorjeni: number
  stopnjaZamujenih: number
  povpTrajanje: string
  stopnjaOdgovorjenih: number
  aktivniAgenti: number
  dohodni: number
  dohodniPercent: number
  odhodni: number
  odhodniPercent: number
  interni: number
  interniPercent: number
}

export async function getOverviewStats(period: string = 'today'): Promise<OverviewStats> {
  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from('cdr_records')
    .select('*')
    .gte('time_start', start)
    .lte('time_start', end)

  if (error) throw error

  const total = data?.length || 0
  const answered = data?.filter(r => r.call_status === 'ANSWERED').length || 0
  const totalTalkTime = data?.filter(r => r.call_status === 'ANSWERED')
    .reduce((sum, r) => sum + (r.talk_duration || 0), 0) || 0
  const avgDuration = answered > 0 ? totalTalkTime / answered : 0

  const inbound = data?.filter(r => r.call_type === 'Inbound').length || 0
  const outbound = data?.filter(r => r.call_type === 'Outbound').length || 0
  const internal = data?.filter(r => r.call_type === 'Internal').length || 0

  const uniqueAgents = new Set(data?.map(r => r.extension)).size

  return {
    skupajKlicev: total,
    odgovorjeni: answered,
    stopnjaZamujenih: total > 0 ? Math.round((total - answered) / total * 100) : 0,
    povpTrajanje: formatDuration(avgDuration),
    stopnjaOdgovorjenih: total > 0 ? Math.round(answered / total * 100) : 0,
    aktivniAgenti: uniqueAgents,
    dohodni: inbound,
    dohodniPercent: total > 0 ? Math.round(inbound / total * 100) : 0,
    odhodni: outbound,
    odhodniPercent: total > 0 ? Math.round(outbound / total * 100) : 0,
    interni: internal,
    interniPercent: total > 0 ? Math.round(internal / total * 100) : 0,
  }
}

export interface HourlyData {
  hour: string
  dohodni: number
  interni: number
  odhodni: number
}

export async function getCallsByHour(period: string = 'today'): Promise<HourlyData[]> {
  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from('cdr_records')
    .select('time_start, call_type')
    .gte('time_start', start)
    .lte('time_start', end)

  if (error) throw error

  const hourly: Record<number, { dohodni: number; interni: number; odhodni: number }> = {}
  for (let h = 8; h <= 17; h++) {
    hourly[h] = { dohodni: 0, interni: 0, odhodni: 0 }
  }

  data?.forEach(record => {
    const hour = new Date(record.time_start).getHours()
    if (hour >= 8 && hour <= 17) {
      if (record.call_type === 'Inbound') hourly[hour].dohodni++
      else if (record.call_type === 'Internal') hourly[hour].interni++
      else if (record.call_type === 'Outbound') hourly[hour].odhodni++
    }
  })

  return Object.entries(hourly).map(([hour, counts]) => ({
    hour: `${hour.padStart(2, '0')}:00`,
    ...counts,
  }))
}

export interface ResponseTimeData {
  time: string
  value: number
}

export async function getResponseTimeTrend(period: string = 'today'): Promise<ResponseTimeData[]> {
  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from('cdr_records')
    .select('time_start, call_duration, talk_duration')
    .eq('call_status', 'ANSWERED')
    .gte('time_start', start)
    .lte('time_start', end)

  if (error) throw error

  const hourly: Record<number, number[]> = {}
  for (let h = 8; h <= 17; h++) {
    hourly[h] = []
  }

  data?.forEach(record => {
    const hour = new Date(record.time_start).getHours()
    if (hour >= 8 && hour <= 17) {
      const ringTime = (record.call_duration || 0) - (record.talk_duration || 0)
      hourly[hour].push(ringTime)
    }
  })

  return Object.entries(hourly).map(([hour, times]) => ({
    time: `${hour.padStart(2, '0')}:00`,
    value: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
  }))
}

export interface AgentStats {
  agent: string
  klici: number
  odgovorjeni: number
  povpPogovor: string
  skupajCas: string
}

export async function getAgentStats(period: string = 'today'): Promise<AgentStats[]> {
  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from('cdr_records')
    .select('extension, call_status, talk_duration')
    .gte('time_start', start)
    .lte('time_start', end)

  if (error) throw error

  const agents: Record<string, { klici: number; odgovorjeni: number; talkTime: number }> = {}

  data?.forEach(record => {
    const ext = record.extension
    if (!agents[ext]) {
      agents[ext] = { klici: 0, odgovorjeni: 0, talkTime: 0 }
    }
    agents[ext].klici++
    if (record.call_status === 'ANSWERED') {
      agents[ext].odgovorjeni++
      agents[ext].talkTime += record.talk_duration || 0
    }
  })

  return Object.entries(agents)
    .map(([ext, stats]) => ({
      agent: ext,
      klici: stats.klici,
      odgovorjeni: stats.odgovorjeni,
      povpPogovor: formatDurationShort(stats.odgovorjeni > 0 ? stats.talkTime / stats.odgovorjeni : 0),
      skupajCas: formatHoursMinutes(stats.talkTime),
    }))
    .sort((a, b) => b.klici - a.klici)
}

// ============================================
// PAGE 2: UČINKOVITOST AGENTOV
// ============================================

export interface PerformanceStats {
  skupajKlicev: number
  stopnjaOdzivnosti: number
  povpTrajanje: string
  skupajCas: string
}

export async function getPerformanceStats(
  period: string = 'last7days',
  agent?: string
): Promise<PerformanceStats> {
  const { start, end } = getDateRange(period)

  let query = supabase
    .from('cdr_records')
    .select('*')
    .gte('time_start', start)
    .lte('time_start', end)

  if (agent && agent !== 'all') {
    query = query.eq('extension', agent)
  }

  const { data, error } = await query

  if (error) throw error

  const total = data?.length || 0
  const answered = data?.filter(r => r.call_status === 'ANSWERED').length || 0
  const totalTalkTime = data?.reduce((sum, r) => sum + (r.talk_duration || 0), 0) || 0
  const avgDuration = answered > 0 ? totalTalkTime / answered : 0

  return {
    skupajKlicev: total,
    stopnjaOdzivnosti: total > 0 ? Math.round(answered / total * 100) : 0,
    povpTrajanje: formatDuration(avgDuration),
    skupajCas: formatHoursMinutes(totalTalkTime),
  }
}

export interface DailyVolumeData {
  day: string
  answered: number
  missed: number
}

export async function getDailyVolume(
  period: string = 'last7days',
  agent?: string
): Promise<DailyVolumeData[]> {
  const { start, end } = getDateRange(period)

  let query = supabase
    .from('cdr_records')
    .select('time_start, call_status')
    .gte('time_start', start)
    .lte('time_start', end)
    .order('time_start', { ascending: true })

  if (agent && agent !== 'all') {
    query = query.eq('extension', agent)
  }

  const { data, error } = await query

  if (error) throw error

  const daily: Record<string, { answered: number; missed: number }> = {}

  data?.forEach(record => {
    const date = record.time_start.split('T')[0]
    if (!daily[date]) {
      daily[date] = { answered: 0, missed: 0 }
    }
    if (record.call_status === 'ANSWERED') {
      daily[date].answered++
    } else {
      daily[date].missed++
    }
  })

  const dayNames = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob']

  return Object.entries(daily).map(([date, counts]) => {
    const d = new Date(date)
    return {
      day: dayNames[d.getDay()],
      answered: counts.answered,
      missed: counts.missed,
    }
  })
}

export interface EfficiencyMetrics {
  povpCasZvonjenja: string
  najdaljsiKlic: string
  najkrajsiKlic: string
  zamujeniKlici: number
}

export async function getEfficiencyMetrics(
  period: string = 'last7days',
  agent?: string
): Promise<EfficiencyMetrics> {
  const { start, end } = getDateRange(period)

  let query = supabase
    .from('cdr_records')
    .select('call_duration, talk_duration, call_status')
    .gte('time_start', start)
    .lte('time_start', end)

  if (agent && agent !== 'all') {
    query = query.eq('extension', agent)
  }

  const { data, error } = await query

  if (error) throw error

  const answered = data?.filter(r => r.call_status === 'ANSWERED') || []
  const missed = data?.filter(r => r.call_status !== 'ANSWERED').length || 0

  const ringTimes = answered.map(r => (r.call_duration || 0) - (r.talk_duration || 0))
  const avgRingTime = ringTimes.length > 0
    ? ringTimes.reduce((a, b) => a + b, 0) / ringTimes.length
    : 0

  const talkTimes = answered.map(r => r.talk_duration || 0)
  const maxTalk = Math.max(...talkTimes, 0)
  const minTalk = talkTimes.length > 0 ? Math.min(...talkTimes.filter(t => t > 0)) : 0

  return {
    povpCasZvonjenja: `${Math.round(avgRingTime)}s`,
    najdaljsiKlic: formatDuration(maxTalk),
    najkrajsiKlic: formatDuration(minTalk),
    zamujeniKlici: missed,
  }
}

export interface DailyBreakdown {
  dan: string
  dohodni: number
  odhodni: number
  skupaj: number
  odgovorjeni: number
  zamujeni: number
  stopnja: number
}

export async function getDailyBreakdown(
  period: string = 'last7days',
  agent?: string
): Promise<DailyBreakdown[]> {
  const { start, end } = getDateRange(period)

  let query = supabase
    .from('cdr_records')
    .select('time_start, call_type, call_status')
    .gte('time_start', start)
    .lte('time_start', end)
    .order('time_start', { ascending: true })

  if (agent && agent !== 'all') {
    query = query.eq('extension', agent)
  }

  const { data, error } = await query

  if (error) throw error

  const dayNames = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob']
  const daily: Record<string, DailyBreakdown> = {}

  data?.forEach(record => {
    const date = record.time_start.split('T')[0]
    const d = new Date(date)
    const dayName = dayNames[d.getDay()]

    if (!daily[date]) {
      daily[date] = {
        dan: dayName,
        dohodni: 0,
        odhodni: 0,
        skupaj: 0,
        odgovorjeni: 0,
        zamujeni: 0,
        stopnja: 0,
      }
    }

    daily[date].skupaj++
    if (record.call_type === 'Inbound') daily[date].dohodni++
    if (record.call_type === 'Outbound') daily[date].odhodni++
    if (record.call_status === 'ANSWERED') {
      daily[date].odgovorjeni++
    } else {
      daily[date].zamujeni++
    }
  })

  return Object.values(daily).map(day => ({
    ...day,
    stopnja: day.skupaj > 0 ? Math.round(day.odgovorjeni / day.skupaj * 100) : 0,
  }))
}

// ============================================
// PAGE 3: ZGODOVINA KLICEV
// ============================================

export interface CallRecord {
  cas: string
  od: string
  za: string
  agent: string
  tip: string
  trajanje: string
  status: string
}

export interface CallHistoryResult {
  records: CallRecord[]
  total: number
  page: number
  totalPages: number
}

export async function getCallHistory(filters: {
  date?: string
  agent?: string
  type?: string
  status?: string
  page?: number
  limit?: number
}): Promise<CallHistoryResult> {
  let query = supabase
    .from('cdr_records')
    .select('*', { count: 'exact' })

  if (filters.date) {
    const { start, end } = getDateRange(filters.date)
    query = query.gte('time_start', start).lte('time_start', end)
  }

  if (filters.agent && filters.agent !== 'all') {
    query = query.eq('extension', filters.agent)
  }

  if (filters.type && filters.type !== 'all') {
    const typeMap: Record<string, string> = {
      'Dohodni': 'Inbound',
      'Odhodni': 'Outbound',
      'Interni': 'Internal',
    }
    query = query.eq('call_type', typeMap[filters.type] || filters.type)
  }

  if (filters.status && filters.status !== 'all') {
    const statusMap: Record<string, string> = {
      'ODGOVORJEN': 'ANSWERED',
      'NI ODGOVORA': 'NO ANSWER',
      'ZAMUJEN': 'NO ANSWER',
    }
    query = query.eq('call_status', statusMap[filters.status] || filters.status)
  }

  const page = filters.page || 1
  const limit = filters.limit || 10
  const offset = (page - 1) * limit

  query = query
    .order('time_start', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  const records = data?.map(r => ({
    cas: new Date(r.time_start).toLocaleTimeString('sl-SI', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    od: r.caller_number,
    za: r.callee_number,
    agent: r.extension,
    tip: translateCallType(r.call_type),
    trajanje: formatDuration(r.talk_duration),
    status: translateStatus(r.call_status),
  })) || []

  return {
    records,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAgentList(): Promise<string[]> {
  const { data, error } = await supabase
    .from('cdr_records')
    .select('extension')

  if (error) throw error

  const unique = [...new Set(data?.map(r => r.extension))]
  return unique.sort()
}

// ============================================
// PAGE 4: ANALITIKA
// ============================================

export interface WeeklyTrendData {
  week: string
  odgovorjeni: number
  skupaj: number
  zamujeni: number
}

export async function getWeeklyTrend(): Promise<WeeklyTrendData[]> {
  const { data, error } = await supabase
    .from('cdr_records')
    .select('time_start, call_status')
    .order('time_start', { ascending: true })

  if (error) throw error

  const weeks: Record<string, { answered: number; total: number }> = {}

  data?.forEach(record => {
    const date = new Date(record.time_start)
    const weekNum = Math.ceil(date.getDate() / 7)
    const weekKey = `Teden ${weekNum}`

    if (!weeks[weekKey]) {
      weeks[weekKey] = { answered: 0, total: 0 }
    }
    weeks[weekKey].total++
    if (record.call_status === 'ANSWERED') {
      weeks[weekKey].answered++
    }
  })

  return Object.entries(weeks).map(([week, stats]) => ({
    week,
    odgovorjeni: stats.answered,
    skupaj: stats.total,
    zamujeni: stats.total - stats.answered,
  }))
}

export interface TopAgent {
  agent: string
  klici: number
  odgovorjeni: number
  stopnja: number
  trend: 'up' | 'down'
}

export async function getTopAgents(limit: number = 5): Promise<TopAgent[]> {
  const { data, error } = await supabase
    .from('cdr_records')
    .select('extension, call_status')

  if (error) throw error

  const agents: Record<string, { total: number; answered: number }> = {}

  data?.forEach(record => {
    const ext = record.extension
    if (!agents[ext]) {
      agents[ext] = { total: 0, answered: 0 }
    }
    agents[ext].total++
    if (record.call_status === 'ANSWERED') {
      agents[ext].answered++
    }
  })

  return Object.entries(agents)
    .map(([agent, stats]) => ({
      agent,
      klici: stats.total,
      odgovorjeni: stats.answered,
      stopnja: Math.round(stats.answered / stats.total * 100 * 10) / 10,
      trend: 'up' as const,
    }))
    .sort((a, b) => b.stopnja - a.stopnja)
    .slice(0, limit)
}

export interface PeakHour {
  hour: string
  klici: number
  percentage: number
}

export async function getPeakHours(limit: number = 5): Promise<PeakHour[]> {
  const { data, error } = await supabase
    .from('cdr_records')
    .select('time_start')

  if (error) throw error

  const hours: Record<string, number> = {}
  let total = 0

  data?.forEach(record => {
    const hour = new Date(record.time_start).getHours()
    const hourKey = `${hour}-${hour + 1} ${hour < 12 ? 'AM' : 'PM'}`
    hours[hourKey] = (hours[hourKey] || 0) + 1
    total++
  })

  return Object.entries(hours)
    .map(([hour, count]) => ({
      hour,
      klici: count,
      percentage: Math.round(count / total * 100 * 10) / 10,
    }))
    .sort((a, b) => b.klici - a.klici)
    .slice(0, limit)
}

export async function getAverageResponseTime(): Promise<{ seconds: number; trend: string }> {
  const { data, error } = await supabase
    .from('cdr_records')
    .select('call_duration, talk_duration')
    .eq('call_status', 'ANSWERED')

  if (error) throw error

  const ringTimes = data?.map(r => (r.call_duration || 0) - (r.talk_duration || 0)) || []
  const avg = ringTimes.length > 0
    ? ringTimes.reduce((a, b) => a + b, 0) / ringTimes.length
    : 0

  return {
    seconds: Math.round(avg * 10) / 10,
    trend: '2.3s hitreje',
  }
}

// ============================================
// AVAILABLE DATES FOR DATEPICKER
// ============================================

export async function getAvailableDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('cdr_records')
    .select('time_start')
    .order('time_start', { ascending: true })

  if (error) throw error

  const dates = new Set(data?.map(r => r.time_start.split('T')[0]) || [])
  return Array.from(dates).sort()
}
