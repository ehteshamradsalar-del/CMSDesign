import { useNavigate } from 'react-router-dom';

export default function CTA() {
    const navigate = useNavigate();

    return (
        <section className="cta">
            <h2>
                Your archive starts
                <br />
                with the first upload.
            </h2>
            <p>Free to start. Your data stays yours.</p>
            <button className="primary-btn" onClick={() => navigate('/signup')}>
                Create your archive
            </button>
        </section>
    );
}