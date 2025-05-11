import chefLogo from "./chef-claude-icon.png"

export default function Header() {
    return (
        <header>
            <img 
                src={chefLogo} 
                alt="Chef Claude Logo" 
                className="chef-logo"
            />
            <h1>Chef Claude</h1>
        </header>
    )
}