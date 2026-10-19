// Display names and grouping for catalog navigation. Unknown categories fall back to a readable name.
export const categoryGroups = [
  { label: 'Electronics', ids: ['development-boards', 'sensors', 'displays', 'robotics'] },
  { label: '3D printing', ids: ['filament', '3d-printed-models', 'display-racks'] },
  { label: 'RC & drones', ids: ['rc-cars', 'drones', 'drone-spare-parts'] },
]
const names: Record<string, string> = {
  all: 'All products',
  'development-boards': 'Development boards',
  sensors: 'Sensors & modules',
  displays: 'OLED displays',
  robotics: 'Robotics & kits',
  filament: '3D printing filament',
  '3d-printed-models': '3D printed models',
  'display-racks': 'Display racks',
  'rc-cars': 'RC cars & trucks',
  drones: 'Camera drones',
  'drone-spare-parts': 'Drone spare parts',
}
export const categoryName = (id: string) => names[id] || id.replace(/-/g, ' ')
