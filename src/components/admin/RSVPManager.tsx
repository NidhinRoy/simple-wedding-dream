
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getRSVPs, deleteRSVP, GuestRSVP } from '@/services/firebase';
import { Check, X, Calendar, Mail, MessageSquare, Trash2, UserPlus, Utensils } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RSVPManager = () => {
  const [rsvps, setRSVPs] = useState<GuestRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRSVP, setSelectedRSVP] = useState<GuestRSVP | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      setLoading(true);
      const guestRSVPs = await getRSVPs();
      setRSVPs(guestRSVPs);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load RSVPs: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rsvpId: string) => {
    try {
      await deleteRSVP(rsvpId);
      setRSVPs(rsvps.filter(rsvp => rsvp.id !== rsvpId));
      
      if (selectedRSVP?.id === rsvpId) {
        setSelectedRSVP(null);
        setViewMode('list');
      }
      
      toast({
        title: "Success",
        description: "RSVP deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (rsvp: GuestRSVP) => {
    setSelectedRSVP(rsvp);
    setViewMode('details');
  };

  const handleBack = () => {
    setSelectedRSVP(null);
    setViewMode('list');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Count statistics
  const countAttending = rsvps.filter(rsvp => rsvp.attending).length;
  const countDeclined = rsvps.filter(rsvp => !rsvp.attending).length;
  const countPlusOnes = rsvps.filter(rsvp => rsvp.plusOne).length;
  const totalGuests = countAttending + countPlusOnes;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-maroon"></div>
      </div>
    );
  }

  if (viewMode === 'details' && selectedRSVP) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            size="sm"
          >
            Back to List
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => handleDelete(selectedRSVP.id)}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">{selectedRSVP.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <Mail size={16} />
              <span>{selectedRSVP.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">RSVP Details</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Attending:</div>
                  <div className="flex items-center">
                    {selectedRSVP.attending ? (
                      <><Check size={18} className="text-green-500 mr-1" /> Yes</>
                    ) : (
                      <><X size={18} className="text-red-500 mr-1" /> No</>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Plus One:</div>
                  <div>
                    {selectedRSVP.plusOne ? (
                      <><UserPlus size={18} className="text-blue-500 mr-1 inline" /> Yes</>
                    ) : (
                      <><X size={18} className="text-gray-400 mr-1 inline" /> No</>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-32 text-gray-500">Dietary Needs:</div>
                  <div className="flex-1">
                    {selectedRSVP.dietaryRestrictions ? (
                      <div className="flex items-start">
                        <Utensils size={18} className="text-amber-500 mr-1 mt-1" />
                        <span>{selectedRSVP.dietaryRestrictions}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">None specified</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-32 text-gray-500">Submitted:</div>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-500 mr-1" />
                    {formatDate(selectedRSVP.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {selectedRSVP.message && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-wedding-maroon" />
                  Message
                </h4>
                <p className="italic text-gray-700">"{selectedRSVP.message}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">RSVP Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Total RSVPs</p>
            <p className="text-2xl font-bold text-wedding-maroon mt-1">{rsvps.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Attending</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{countAttending}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Not Attending</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{countDeclined}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Total Guests</p>
            <p className="text-2xl font-bold text-wedding-gold mt-1">{totalGuests}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Guest RSVP List</h3>
        {rsvps.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No RSVPs received yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plus One</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map(rsvp => (
                  <TableRow key={rsvp.id}>
                    <TableCell className="font-medium">{rsvp.name}</TableCell>
                    <TableCell>{rsvp.email}</TableCell>
                    <TableCell>
                      {rsvp.attending ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <Check size={12} className="mr-1" />
                          Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          <X size={12} className="mr-1" />
                          Declined
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {rsvp.plusOne ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <UserPlus size={12} className="mr-1" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(rsvp.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(rsvp)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPManager;
