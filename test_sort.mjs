const filteredBookings = [
  { id: 1, status: 'Scheduled', scheduled_for: '2023-01-01T10:00:00Z', profiles: { full_name: 'Alice' }, tours: { properties: { title: 'Villa', price: 1000 } } },
  { id: 2, status: 'Completed', scheduled_for: '2023-01-02T10:00:00Z', profiles: { full_name: 'Charlie' }, tours: { properties: { title: 'Apartment', price: 500 } } },
  { id: 3, status: 'Cancelled', scheduled_for: '2023-01-01T15:00:00Z', profiles: { full_name: 'Bob' }, tours: { properties: { title: 'Mansion', price: 5000 } } }
];

const getProfile = (b) => Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;
const getTour = (b) => Array.isArray(b.tours) ? b.tours[0] : b.tours;
const getProperty = (t) => t ? (Array.isArray(t.properties) ? t.properties[0] : t.properties) : null;

const sortConfig = { key: 'client', direction: 'asc' };

const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue = '';
    let bValue = '';

    const profileA = getProfile(a);
    const profileB = getProfile(b);
    const tourA = getTour(a);
    const tourB = getTour(b);
    const propA = getProperty(tourA);
    const propB = getProperty(tourB);

    switch (sortConfig.key) {
        case 'client':
            aValue = profileA?.full_name?.toLowerCase() || '';
            bValue = profileB?.full_name?.toLowerCase() || '';
            break;
        case 'property':
            aValue = propA?.title?.toLowerCase() || '';
            bValue = propB?.title?.toLowerCase() || '';
            break;
        case 'price':
            aValue = Number(propA?.price || 0);
            bValue = Number(propB?.price || 0);
            break;
        case 'date':
            aValue = new Date(a.scheduled_for || 0).getTime();
            bValue = new Date(b.scheduled_for || 0).getTime();
            break;
        case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
        default:
            break;
    }

    if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
});

console.log(sortedBookings.map(b => b.profiles.full_name));

sortConfig.direction = 'desc';
const sortedBookingsDesc = [...filteredBookings].sort((a, b) => {
    let aValue = getProfile(a)?.full_name?.toLowerCase() || '';
    let bValue = getProfile(b)?.full_name?.toLowerCase() || '';
    
    if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
});
console.log(sortedBookingsDesc.map(b => b.profiles.full_name));

