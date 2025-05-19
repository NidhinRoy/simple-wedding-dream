
// Update import path at the top of the file
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  TimelineEvent,
  getTimelineEvents,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  updateTimelineOrder
} from '@/services/firebase';
import { Plus, Trash2, MoveVertical, Calendar } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const TimelineEditor = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({
    title: '',
    time: '',
    description: '',
    order: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const timelineEvents = await getTimelineEvents();
      setEvents(timelineEvents);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load timeline events: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.time) {
      toast({
        title: "Validation Error",
        description: "Title and time are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      const eventWithOrder = {
        ...newEvent,
        order: events.length
      };
      
      const addedEvent = await addTimelineEvent(eventWithOrder);
      setEvents([...events, addedEvent]);
      
      // Reset form
      setNewEvent({
        title: '',
        time: '',
        description: '',
        order: 0
      });
      
      toast({
        title: "Success",
        description: "Timeline event added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add event: " + error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteTimelineEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedEvents = Array.from(events);
    const [removed] = reorderedEvents.splice(result.source.index, 1);
    reorderedEvents.splice(result.destination.index, 0, removed);
    
    // Update state immediately for responsive UI
    setEvents(reorderedEvents);
    
    try {
      // Save the new order to Firebase
      await updateTimelineOrder(reorderedEvents);
      
      toast({
        title: "Success",
        description: "Event order updated",
      });
    } catch (error: any) {
      // If error, revert to previous state
      fetchEvents();
      
      toast({
        title: "Error",
        description: "Failed to update event order: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof Omit<TimelineEvent, 'id'>, value: string) => {
    setNewEvent({
      ...newEvent,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Timeline Event</h3>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Wedding Ceremony"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Event Time</Label>
              <Input
                id="event-time"
                value={newEvent.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                placeholder="e.g., 10:00 AM"
                disabled={saving}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              value={newEvent.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe this event..."
              rows={3}
              disabled={saving}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-wedding-maroon hover:bg-wedding-deep-red"
            disabled={saving || !newEvent.title || !newEvent.time}
          >
            {saving ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Timeline Events</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-maroon"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No events in the timeline yet</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="timeline-events">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {events.map((event, index) => (
                    <Draggable key={event.id} draggableId={event.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center bg-gray-50 p-4 rounded-md border border-gray-100"
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="p-2 cursor-grab text-gray-400 hover:text-wedding-maroon"
                          >
                            <MoveVertical size={20} />
                          </div>
                          <div className="flex-1 ml-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                              <h4 className="font-medium">{event.title}</h4>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {event.time}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm mt-1 text-gray-600">{event.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default TimelineEditor;
