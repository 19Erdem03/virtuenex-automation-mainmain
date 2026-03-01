const bookings = [
    { client: "Zack", property: "A Villa", price: 500, status: 'Scheduled', date: 2 },
    { client: "Alice", property: "B Condo", price: 300, status: 'Completed', date: 3 },
    { client: "Bob", property: "C House", price: 800, status: 'Cancelled', date: 1 }
];

function sortBookings(key, direction) {
    return [...bookings].sort((a, b) => {
        let aValue = a[key] || '';
        let bValue = b[key] || '';
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
}
console.log("Client asc:", sortBookings('client', 'asc').map(b => b.client));
console.log("Client desc:", sortBookings('client', 'desc').map(b => b.client));
console.log("Price asc:", sortBookings('price', 'asc').map(b => b.price));
console.log("Price desc:", sortBookings('price', 'desc').map(b => b.price));
