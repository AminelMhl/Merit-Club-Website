import Link from "next/link"

const Hero = () => {
    return (
        <div className="hero-section">
            <h1 className="text">&quot;Make Everything <span className="Related">Related</span> to IT&quot;</h1>
            <p className="sub-text">Dive into coding, design, and emerging
                                    tech trends in a practical, fun way</p>
            <div className="button-container">
                <Link href="/explore-more">Explore more</Link>
                <Link href="/login">Login</Link>
            </div>
            
        </div>
    )
}

export default Hero;