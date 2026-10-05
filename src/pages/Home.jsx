import Hero from '../components/Hero/Hero';
import Domains from '../components/Domains/Domains';
import Campus from '../components/Campus/Campus';
import EventsSlider from '../components/EventsSlider/EventsSlider';
import TeamPreview from '../components/TeamPreview/TeamPreview';

export default function Home() {
    return (
        <>
            <Hero />
            <Domains />
            <Campus />
            <EventsSlider />
            <TeamPreview />
        </>
    );
}
