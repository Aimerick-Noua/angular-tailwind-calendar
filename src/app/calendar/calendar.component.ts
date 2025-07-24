import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div class="p-4">
      <full-calendar [options]="calendarOptions()" class="bg-white rounded-lg shadow border p-4" />
    </div>
  `,
})
export class CalendarComponent {
  events: WritableSignal<EventInput[]> = signal([
    {
      id: '1',
      title: 'Entretien RH',
      start: '2025-07-25',
      color: '#1d4ed8'
    }
  ]);

calendarOptions = signal<CalendarOptions>({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin], 
  initialView: 'dayGridMonth',
  selectable: true,
  editable: true,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay' 
  },
  events: this.events(),
  dateClick: this.onDateClick.bind(this),
  eventClick: this.onEventClick.bind(this),
  eventDrop: this.onEventDrop.bind(this),
  eventContent: (arg) => ({
    html: `<div class="bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm">${arg.event.title}</div>`
  }),
});


  // ➕ Add event when a date is clicked
  onDateClick(arg: DateClickArg) {
    const title = prompt('Enter event title:');
    if (!title) return;

    const newEvent: EventInput = {
      id: String(Date.now()),
      title,
      start: arg.dateStr,
      color: '#22c55e'
    };

    const updated = [...this.events(), newEvent];
    this.events.set(updated);
    this.refreshCalendarEvents();
  }

  // ❌ Remove event on click
  onEventClick(info: EventClickArg) {
    if (confirm(`Delete "${info.event.title}"?`)) {
      const updated = this.events().filter(e => e.id !== info.event.id);
      this.events.set(updated);
      this.refreshCalendarEvents();
    }
  }

  // 🔄 Force refresh of calendar events
  refreshCalendarEvents() {
    const current = this.calendarOptions();
    this.calendarOptions.set({
      ...current,
      events: this.events()
    });
  }

  onEventDrop(info: any) {
  const updatedEvents = this.events().map(e => {
    if (e.id === info.event.id) {
      return {
        ...e,
        start: info.event.startStr,
        end: info.event.endStr
      };
    }
    return e;
  });

  this.events.set(updatedEvents);
  this.refreshCalendarEvents();
}
}
