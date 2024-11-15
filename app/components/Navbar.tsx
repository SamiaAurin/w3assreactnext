import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-end items-center h-20 px-8 bg-white shadow-md">
      <ul className="flex items-center space-x-8">
        <li><Link href="#" className="flex items-center text-xl font-medium text-gray-700">🌐 United States</Link></li>
        <li><Link href="#" className="text-xl font-medium text-gray-700">Trip Boards</Link></li>
        <li><Link href="#" className="text-xl font-medium text-gray-700">List your property</Link></li>
        <li><Link href="#" className="text-xl font-medium text-gray-700">Help</Link></li>
        <li><Link href="#" className="text-xl font-medium text-gray-700">My trips</Link></li>
        <li><Link href="#" className="text-xl font-medium text-gray-700">Sign in</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
