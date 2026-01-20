'use client';

import BaseModal from './BaseModal';

export default function WishlistModal({
  wishlist,
  onClose,
}: {
  wishlist: any;
  onClose: () => void;
}) {
  return (
    <BaseModal title="My Wishlist" onClose={onClose}>
      <pre className="bg-gray-100 p-4 rounded-lg text-sm">
        {JSON.stringify(wishlist, null, 2)}
      </pre>
    </BaseModal>
  );
}
