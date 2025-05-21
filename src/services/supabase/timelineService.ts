
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { TimelineEvent } from "../firebase/types";

// Store timeline locally when offline
const localStorageKey = "wedding_timeline_offline";

const getLocalTimeline = (): TimelineEvent[] => {
  const saved = localStorage.getItem(localStorageKey);
  return saved ? JSON.parse(saved) : [];
};

const saveLocalTimeline = (events: TimelineEvent[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(events));
};

// Check if offline
const isOffline = () => !navigator.onLine;

// Timeline Event Management
export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  try {
    // If offline, return local storage data first
    if (isOffline()) {
      const localEvents = getLocalTimeline();
      if (localEvents.length > 0) {
        return localEvents;
      }
    }
    
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('order');
    
    if (error) throw error;
    
    const events = data.map(event => ({
      id: event.id,
      title: event.title,
      time: event.time,
      description: event.description || '',
      order: event.order
    }));
    
    // Save to local storage for offline use
    saveLocalTimeline(events);
    
    return events;
  } catch (error) {
    console.error("Error getting timeline events:", error);
    
    // Fall back to local storage if Supabase fails
    const localEvents = getLocalTimeline();
    if (localEvents.length > 0) {
      return localEvents;
    }
    
    throw error;
  }
};

export const addTimelineEvent = async (event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> => {
  try {
    const id = uuidv4();
    const eventData = { ...event, id };
    
    // If offline, store in local storage only
    if (isOffline()) {
      const localEvents = getLocalTimeline();
      saveLocalTimeline([...localEvents, eventData]);
      return eventData;
    }
    
    const { error } = await supabase
      .from('timeline_events')
      .insert({
        id: eventData.id,
        title: eventData.title,
        time: eventData.time,
        description: eventData.description,
        order: eventData.order
      });
    
    if (error) throw error;
    
    // Update local storage with the new event
    const localEvents = getLocalTimeline();
    saveLocalTimeline([...localEvents, eventData]);
    
    return eventData;
  } catch (error) {
    console.error("Error adding timeline event:", error);
    throw error;
  }
};

export const updateTimelineEvent = async (event: TimelineEvent): Promise<void> => {
  try {
    // Update local storage regardless of online status
    const localEvents = getLocalTimeline();
    const updatedEvents = localEvents.map(e => 
      e.id === event.id ? event : e
    );
    saveLocalTimeline(updatedEvents);
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    const { error } = await supabase
      .from('timeline_events')
      .update({
        title: event.title,
        time: event.time,
        description: event.description,
        order: event.order
      })
      .eq('id', event.id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating timeline event:", error);
    throw error;
  }
};

export const deleteTimelineEvent = async (eventId: string): Promise<void> => {
  try {
    // Update local storage regardless of online status
    const localEvents = getLocalTimeline();
    saveLocalTimeline(localEvents.filter(e => e.id !== eventId));
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', eventId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    throw error;
  }
};

export const updateTimelineOrder = async (events: TimelineEvent[]): Promise<void> => {
  try {
    // Update local storage regardless of online status
    saveLocalTimeline(events);
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    // Update each event with its new order
    const updatePromises = events.map((event, index) => {
      return supabase
        .from('timeline_events')
        .update({ order: index })
        .eq('id', event.id);
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating timeline order:", error);
    throw error;
  }
};
