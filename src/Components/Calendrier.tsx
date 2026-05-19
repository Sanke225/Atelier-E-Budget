import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function Calendrier() {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <div className="bg-white p-1 w-fit mx-1 rounded-2xl shadow">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        classNames={{
          months: "flex flex-col",
          month: "space-y-4",
          month_caption: "flex items-center justify-center text-sm font-semibold mb-4",
          nav: "flex items-center gap-2 justify-center mb-2",
          button_previous: "h-7 w-7 rounded-md hover:bg-blue-100 flex items-center justify-center",
          button_next: "h-7 w-7 rounded-md hover:bg-blue-100 flex items-center justify-center",
          weekday: "text-sm text-gray-500",
          day: "h-8 w-8 text-sm rounded-md hover:bg-orange-400",
          selected: "!bg-orange-500 !text-white",
        }}
      />

      {selected ? (
        <p className="mt-4 text-sm font-semibold text-orange-500">
          Date choisie : {selected.toLocaleDateString()}
        </p>
      ) : (
        <p className="mt-4 text-sm font-mono text-gray-400">
          Aucune date sélectionnée
        </p>
      )}
    </div>
  );
}

export default Calendrier;