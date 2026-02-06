export const MEAL_PLAN_LABELS: Record<string, string> = {
    'none': 'بدون وجبات',
    'breakfast': 'شامل الإفطار',
    'half_board': 'وجبتين',
    'full_board': 'إقامة كاملة',
    'all_inclusive': 'إقامة شاملة كلياً'
};

export const MEAL_PLANS = [
    { id: 'none', label: MEAL_PLAN_LABELS['none'] },
    { id: 'breakfast', label: MEAL_PLAN_LABELS['breakfast'] },
    { id: 'half_board', label: MEAL_PLAN_LABELS['half_board'] },
    { id: 'full_board', label: MEAL_PLAN_LABELS['full_board'] },
    { id: 'all_inclusive', label: MEAL_PLAN_LABELS['all_inclusive'] }
];

export const ROOM_TYPE_LABELS: Record<string, string> = {
    'single': 'غرفة فردية',
    'double': 'غرفة ثنائية',
    'triple': 'غرفة ثلاثية',
    'quad': 'غرفة رباعية',
    'suite': 'جناح',
    'studio': 'استوديو',
    'apartment': 'شقة فندقية',
    'family': 'غرفة عائلية',
    'penthouse': 'بنتهاوس',
    'villa': 'فيلا'
};
