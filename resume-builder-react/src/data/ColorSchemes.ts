// 20 color scheme presets extracted from individual templates
// Organized in 3 categories: Professional, Classic, Vibrant

export interface ColorScheme {
  id: string;
  name: string;
  category: 'Professional' | 'Classic' | 'Vibrant';
  colors: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    // Sidebar-specific (for two-column templates)
    sidebarBg?: string;
    sidebarText?: string;
    sidebarAccent?: string;
  };
}

export const COLOR_SCHEMES: ColorScheme[] = [
  // ── Professional ──
  {
    id: 'california',
    name: 'California Beaches',
    category: 'Professional',
    colors: {
      primaryColor: '#7D99AA',
      accentColor: '#FFC067',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#7D99AA',
      sidebarAccent: '#FFC067',
    },
  },
  {
    id: 'cobalt',
    name: 'Cobalt Sky',
    category: 'Professional',
    colors: {
      primaryColor: '#000080',
      accentColor: '#6D8196',
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      sidebarBg: '#000080',
      sidebarAccent: '#6D8196',
    },
  },
  {
    id: 'salt',
    name: 'Salt & Pepper',
    category: 'Professional',
    colors: {
      primaryColor: '#2B2B2B',
      accentColor: '#B3B3B3',
      backgroundColor: '#ffffff',
      textColor: '#2B2B2B',
      sidebarBg: '#2B2B2B',
      sidebarAccent: '#B3B3B3',
    },
  },
  {
    id: 'gothic',
    name: 'Gothic',
    category: 'Professional',
    colors: {
      primaryColor: '#000000',
      accentColor: '#988686',
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      sidebarBg: '#000000',
      sidebarAccent: '#988686',
    },
  },
  {
    id: 'harbor',
    name: 'Harbor Haze',
    category: 'Professional',
    colors: {
      primaryColor: '#5C8DC5',
      accentColor: '#AD9E90',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#5C8DC5',
      sidebarAccent: '#AD9E90',
    },
  },

  // ── Classic ──
  {
    id: 'winter',
    name: 'Winter Chill',
    category: 'Classic',
    colors: {
      primaryColor: '#0B2E33',
      accentColor: '#4F7C82',
      backgroundColor: '#ffffff',
      textColor: '#0B2E33',
      sidebarBg: '#0B2E33',
      sidebarAccent: '#4F7C82',
    },
  },
  {
    id: 'slate',
    name: 'Slate & Cream',
    category: 'Classic',
    colors: {
      primaryColor: '#4A4A4A',
      accentColor: '#6D8196',
      backgroundColor: '#ffffff',
      textColor: '#4A4A4A',
      sidebarBg: '#4A4A4A',
      sidebarAccent: '#6D8196',
    },
  },
  {
    id: 'noir',
    name: 'Noir & Taupe',
    category: 'Classic',
    colors: {
      primaryColor: '#000000',
      accentColor: '#5C4E4E',
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      sidebarBg: '#000000',
      sidebarAccent: '#5C4E4E',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant Teal',
    category: 'Classic',
    colors: {
      primaryColor: '#245F73',
      accentColor: '#733E24',
      backgroundColor: '#ffffff',
      textColor: '#245F73',
      sidebarBg: '#245F73',
      sidebarAccent: '#733E24',
    },
  },
  {
    id: 'sand',
    name: 'Sand & Gold',
    category: 'Classic',
    colors: {
      primaryColor: '#AD9C8E',
      accentColor: '#E8D59E',
      backgroundColor: '#ffffff',
      textColor: '#4A4A4A',
      sidebarBg: '#AD9C8E',
      sidebarAccent: '#E8D59E',
    },
  },
  {
    id: 'industrial',
    name: 'Industrial Blue',
    category: 'Classic',
    colors: {
      primaryColor: '#736F60',
      accentColor: '#5C8DC5',
      backgroundColor: '#ffffff',
      textColor: '#4A4A4A',
      sidebarBg: '#736F60',
      sidebarAccent: '#5C8DC5',
    },
  },

  // ── Vibrant ──
  {
    id: 'stone',
    name: 'Stone Path',
    category: 'Vibrant',
    colors: {
      primaryColor: '#968F83',
      accentColor: '#A49A87',
      backgroundColor: '#ffffff',
      textColor: '#4A4A4A',
      sidebarBg: '#968F83',
      sidebarAccent: '#A49A87',
    },
  },
  {
    id: 'urban',
    name: 'Urban Loft',
    category: 'Vibrant',
    colors: {
      primaryColor: '#464646',
      accentColor: '#A35E47',
      backgroundColor: '#ffffff',
      textColor: '#464646',
      sidebarBg: '#464646',
      sidebarAccent: '#A35E47',
    },
  },
  {
    id: 'calm',
    name: 'Calm Blue',
    category: 'Vibrant',
    colors: {
      primaryColor: '#517891',
      accentColor: '#57B9FF',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#517891',
      sidebarAccent: '#57B9FF',
    },
  },
  {
    id: 'moonlight',
    name: 'Under the Moonlight',
    category: 'Vibrant',
    colors: {
      primaryColor: '#292966',
      accentColor: '#5C5C99',
      backgroundColor: '#ffffff',
      textColor: '#292966',
      sidebarBg: '#292966',
      sidebarAccent: '#5C5C99',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Odyssey',
    category: 'Vibrant',
    colors: {
      primaryColor: '#00674F',
      accentColor: '#3EBB9E',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#00674F',
      sidebarAccent: '#3EBB9E',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Tide',
    category: 'Vibrant',
    colors: {
      primaryColor: '#4052D6',
      accentColor: '#005C5C',
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      sidebarBg: '#4052D6',
      sidebarAccent: '#005C5C',
    },
  },
  {
    id: 'peach',
    name: 'Peach Skyline',
    category: 'Vibrant',
    colors: {
      primaryColor: '#496580',
      accentColor: '#BADDFF',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#496580',
      sidebarAccent: '#BADDFF',
    },
  },
  {
    id: 'rainforest',
    name: 'Tropical Rainforest',
    category: 'Vibrant',
    colors: {
      primaryColor: '#4F7942',
      accentColor: '#71AA34',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#4F7942',
      sidebarAccent: '#71AA34',
    },
  },
  {
    id: 'meadow',
    name: 'Wildflower Meadow',
    category: 'Vibrant',
    colors: {
      primaryColor: '#82C8E5',
      accentColor: '#7CFC00',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#82C8E5',
      sidebarAccent: '#7CFC00',
    },
  },
  {
    id: 'breeze',
    name: 'Summer Breeze',
    category: 'Vibrant',
    colors: {
      primaryColor: '#82C8E5',
      accentColor: '#E6D8C4',
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      sidebarBg: '#82C8E5',
      sidebarAccent: '#E6D8C4',
    },
  },
];
