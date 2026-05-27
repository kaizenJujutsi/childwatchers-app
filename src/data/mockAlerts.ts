export interface ZoneAlert {
  id: string;
  type: 'amber' | 'info' | 'resolved';
  zone: string;
  time: string;
  message: string;
  reportedBy: string;
}

export const ZONE_ALERTS: ZoneAlert[] = [
  {
    id: 'a1',
    type: 'amber',
    zone: 'Kilimani Zone B',
    time: '14:32',
    message: 'Suspicious vehicle reported near ABC Nursery School. Blue Nissan Wingroad, plate KDJ 4**X. Police notified.',
    reportedBy: 'Nyumba Kumi Unit 7',
  },
  {
    id: 'a2',
    type: 'info',
    zone: 'Lavington',
    time: '13:15',
    message: 'Community alert: Street lights on Valley Road are non-operational tonight. Escort children after dark.',
    reportedBy: 'Kilimani DCI Post',
  },
  {
    id: 'a3',
    type: 'resolved',
    zone: 'Kilimani Zone A',
    time: '11:48',
    message: 'Earlier alert resolved. Missing child (age 6) has been found safe at grandmother\'s home. Thank you for vigilance.',
    reportedBy: 'DCI Response Team',
  },
  {
    id: 'a4',
    type: 'info',
    zone: 'Westlands',
    time: '09:20',
    message: 'School security briefing: St. Austin\'s primary will conduct emergency drill at 3pm. Do not be alarmed by sirens.',
    reportedBy: 'School Safety Board',
  },
];

export const SOS_RECENT: { id: string; name: string; zone: string; time: string; status: string }[] = [
  { id: 's1', name: 'Amina K.', zone: 'Kilimani B', time: '2h ago', status: 'Resolved — Police Response' },
  { id: 's2', name: 'Anonymous', zone: 'Lavington', time: '6h ago', status: 'Resolved — False Alarm' },
  { id: 's3', name: 'Grace N. (Watcher)', zone: 'Kilimani A', time: '1d ago', status: 'Resolved — Child Safe' },
];
