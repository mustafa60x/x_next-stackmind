'use client';

import NavLink from "./nav-link";

export default function MainHeader() {
    return (
        <nav className="flex items-center justify-between bg-gray-800 p-2 text-white h-16">
            <NavLink href="/dashboard">Home</NavLink>
            <div className="flex space-x-4">
                <NavLink href="/posts">Posts (Server Component)</NavLink>
                <NavLink href="/settings">Settings</NavLink>
                <NavLink href="/profile">Profile</NavLink>
            </div>
        </nav>
    );
}
