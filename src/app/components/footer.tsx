export default function Footer() {
    const date = new Date().getFullYear();
    return (
        <footer>
            <div className="flex justify-center bg-transparent p-4">
                <p>&copy; {date} Carbon Marketplace. All rights reserved.</p>
            </div>
        </footer>
    )
}