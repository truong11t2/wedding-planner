'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/common/Toast';
import { Users, Plus, Edit2, Trash2, Mail, Phone, MapPin, Gift, Check, X } from 'lucide-react';
import { 
  getGuestList, 
  saveGuestList, 
  addGuest as apiAddGuest,
  updateGuest as apiUpdateGuest,
  deleteGuest as apiDeleteGuest,
  updateRSVP as apiUpdateRSVP,
  getGuestStats,
  Guest,
  GuestStats
} from '@/lib/api';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
  side: 'bride' | 'groom';
  editGuest?: Guest | null;
}

function AddGuestModal({ isOpen, onClose, onSave, side, editGuest }: AddGuestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    plusOne: false,
    plusOneName: '',
    dietaryRestrictions: '',
    notes: '',
    rsvpStatus: 'pending' as 'pending' | 'attending' | 'declined' | 'no-response'
  });

  useEffect(() => {
    if (editGuest) {
      setFormData({
        name: editGuest.name,
        email: editGuest.email || '',
        phone: editGuest.phone || '',
        address: editGuest.address || '',
        plusOne: editGuest.plusOne,
        plusOneName: editGuest.plusOneName || '',
        dietaryRestrictions: editGuest.dietaryRestrictions || '',
        notes: editGuest.notes || '',
        rsvpStatus: editGuest.rsvpStatus
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        plusOne: false,
        plusOneName: '',
        dietaryRestrictions: '',
        notes: '',
        rsvpStatus: 'pending'
      });
    }
  }, [editGuest, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      side
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editGuest ? 'Edit Guest' : `Add Guest to ${side === 'bride' ? 'Bride\'s' : 'Groom\'s'} Side`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Guest name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="guest@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Mailing address"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RSVP Status
              </label>
              <select
                value={formData.rsvpStatus}
                onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as 'pending' | 'attending' | 'declined' | 'no-response' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
                <option value="no-response">No Response</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="plusOne"
                checked={formData.plusOne}
                onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <label htmlFor="plusOne" className="ml-2 text-sm text-gray-700">
                Plus One
              </label>
            </div>

            {formData.plusOne && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plus One Name
                </label>
                <input
                  type="text"
                  value={formData.plusOneName}
                  onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Plus one name (optional)"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Restrictions
              </label>
              <input
                type="text"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Vegetarian, allergies, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Any additional notes"
                rows={2}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                {editGuest ? 'Update' : 'Add'} Guest
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface GuestCardProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
}

function GuestCard({ guest, onEdit, onDelete }: GuestCardProps) {
  const getRSVPStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'no-response': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRSVPStatusIcon = (status: string) => {
    switch (status) {
      case 'attending': return <Check className="h-4 w-4" />;
      case 'declined': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{guest.name}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(guest)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(guest.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRSVPStatusColor(guest.rsvpStatus)}`}>
          {getRSVPStatusIcon(guest.rsvpStatus)}
          <span className="ml-1 capitalize">{guest.rsvpStatus.replace('-', ' ')}</span>
        </div>

        {guest.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{guest.email}</span>
          </div>
        )}

        {guest.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{guest.phone}</span>
          </div>
        )}

        {guest.address && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{guest.address}</span>
          </div>
        )}

        {guest.plusOne && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Plus One:</span> {guest.plusOneName || 'TBD'}
          </div>
        )}

        {guest.dietaryRestrictions && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Dietary:</span> {guest.dietaryRestrictions}
          </div>
        )}

        {guest.notes && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {guest.notes}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GuestsPage() {
  const { isLoggedIn, user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSide, setModalSide] = useState<'bride' | 'groom'>('bride');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Helper function to show toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Load guest list from backend
  useEffect(() => {
    const loadGuestData = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          const response = await getGuestList();
          if (response.success && response.data) {
            setGuests(response.data);
          } else {
            // Initialize with empty list if no data exists
            setGuests([]);
          }
        } catch (error) {
          console.error('Error loading guest list:', error);
          showToast('Failed to load guest list', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    loadGuestData();
  }, [isLoggedIn]);

  // Auto-save guest list whenever guests change (debounced)
  useEffect(() => {
    if (guests.length >= 0 && isLoggedIn && !loading) {
      const timeoutId = setTimeout(async () => {
        try {
          await saveGuestList(guests);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 1000); // Debounce auto-save by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [guests, isLoggedIn, loading]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Manage your guest list by logging in first.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Loading your guest list...</h2>
        </div>
      </div>
    );
  }

  const handleAddGuest = (side: 'bride' | 'groom') => {
    setModalSide(side);
    setEditingGuest(null);
    setIsModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setModalSide(guest.side);
    setIsModalOpen(true);
  };

  const handleSaveGuest = async (guestData: Omit<Guest, 'id' | 'createdAt'>) => {
    try {
      if (editingGuest) {
        // Update existing guest
        const response = await apiUpdateGuest(editingGuest.id, guestData);
        if (response.success && response.data) {
          setGuests(prev => prev.map(g => 
            g.id === editingGuest.id ? response.data! : g
          ));
          showToast(`${guestData.name} has been updated successfully`, 'success');
        } else {
          showToast(response.message || 'Failed to update guest', 'error');
        }
      } else {
        // Add new guest
        const response = await apiAddGuest(guestData);
        if (response.success && response.data) {
          setGuests(prev => [...prev, response.data!]);
          showToast(`${guestData.name} has been added to your guest list`, 'success');
        } else {
          showToast(response.message || 'Failed to add guest', 'error');
        }
      }
    } catch (error) {
      showToast('Error saving guest', 'error');
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest && window.confirm(`Are you sure you want to remove ${guest.name} from your guest list?`)) {
      try {
        const response = await apiDeleteGuest(guestId);
        if (response.success) {
          setGuests(prev => prev.filter(g => g.id !== guestId));
          showToast(`${guest.name} has been removed from your guest list`, 'success');
        } else {
          showToast(response.message || 'Failed to delete guest', 'error');
        }
      } catch (error) {
        showToast('Error deleting guest', 'error');
      }
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const brideGuests = filteredGuests.filter(guest => guest.side === 'bride');
  const groomGuests = filteredGuests.filter(guest => guest.side === 'groom');

  const getGuestStats = (side: 'bride' | 'groom') => {
    const sideGuests = guests.filter(guest => guest.side === side);
    const attending = sideGuests.filter(guest => guest.rsvpStatus === 'attending').length;
    const declined = sideGuests.filter(guest => guest.rsvpStatus === 'declined').length;
    const pending = sideGuests.filter(guest => guest.rsvpStatus === 'pending').length;
    const totalPlusOnes = sideGuests.filter(guest => guest.plusOne && guest.rsvpStatus === 'attending').length;
    
    return {
      total: sideGuests.length,
      attending,
      declined,
      pending,
      totalPlusOnes,
      totalAttending: attending + totalPlusOnes
    };
  };

  const brideStats = getGuestStats('bride');
  const groomStats = getGuestStats('groom');

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Management</h1>
          <p className="text-gray-600">
            Organize your wedding guest list and track RSVPs for both sides.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-500 mr-2" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{guests.length}</div>
                <div className="text-sm text-gray-500">Total Guests</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="h-6 w-6 text-green-500 mr-2" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {brideStats.totalAttending + groomStats.totalAttending}
                </div>
                <div className="text-sm text-gray-500">Expected Attendees</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Gift className="h-6 w-6 text-purple-500 mr-2" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {brideStats.totalPlusOnes + groomStats.totalPlusOnes}
                </div>
                <div className="text-sm text-gray-500">Plus Ones</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <X className="h-6 w-6 text-red-500 mr-2" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {brideStats.declined + groomStats.declined}
                </div>
                <div className="text-sm text-gray-500">Declined</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search guests by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Guest Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bride's Side */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Bride's Side</h2>
                <button
                  onClick={() => handleAddGuest('bride')}
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{brideStats.total}</div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{brideStats.attending}</div>
                  <div className="text-gray-500">Attending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">{brideStats.pending}</div>
                  <div className="text-gray-500">Pending</div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {brideGuests.length > 0 ? (
                <div className="space-y-4">
                  {brideGuests.map((guest) => (
                    <GuestCard
                      key={guest.id}
                      guest={guest}
                      onEdit={handleEditGuest}
                      onDelete={handleDeleteGuest}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No guests added yet</p>
                  <button
                    onClick={() => handleAddGuest('bride')}
                    className="mt-2 text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Add your first guest
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Groom's Side */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Groom's Side</h2>
                <button
                  onClick={() => handleAddGuest('groom')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{groomStats.total}</div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{groomStats.attending}</div>
                  <div className="text-gray-500">Attending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">{groomStats.pending}</div>
                  <div className="text-gray-500">Pending</div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {groomGuests.length > 0 ? (
                <div className="space-y-4">
                  {groomGuests.map((guest) => (
                    <GuestCard
                      key={guest.id}
                      guest={guest}
                      onEdit={handleEditGuest}
                      onDelete={handleDeleteGuest}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No guests added yet</p>
                  <button
                    onClick={() => handleAddGuest('groom')}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add your first guest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Guest Modal */}
        <AddGuestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveGuest}
          side={modalSide}
          editGuest={editingGuest}
        />
      </div>

      {/* Toast Component */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}