import Events from '../components/Events/Events';
import Newsletter from '../components/Newsletter/Newsletter';

export default function EventsPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#000000' }}>
            <Events />
            <Newsletter />
        </div>
    );
}
