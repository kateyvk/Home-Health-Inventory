import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b bg-blue-300 px-6 py-4">
            <div className="flex gap-6 text-gray-800 text-align-center text-md font-large">
                <Link href="/">Home</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/inventory">Inventory</Link>
                <Link href="/guides">Caregiver Guides</Link>
                <Link href="/alerts">Alerts</Link>
            </div>
        </nav>
        
    ); 
}