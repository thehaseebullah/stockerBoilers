"use client";

import { useState } from "react";
import { Button } from "@stoker/ui";
import { enqueueFieldCommand, drainOutbox } from "@stoker/field-sync";
import { MapPin, Camera, CheckCircle2, Clock, Users } from "lucide-react";

export default function FieldAttendancePage() {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [actingAsSupervisor, setActingAsSupervisor] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState("EMP-002");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleToggleAttendance = async (kind: "check_in" | "check_out") => {
    setSubmitting(true);
    try {
      await enqueueFieldCommand({
        name: "hr.record_attendance",
        payload: {
          siteId: "20000000-0000-0000-0000-000000000001",
          employeeId: actingAsSupervisor ? selectedWorker : "60000000-0000-0000-0000-000000000001",
          kind,
          lat: 31.5204,
          lng: 74.3587,
          selfieUrl: "proof/attendance/selfie_001.jpg",
          verifiedBySupervisorId: actingAsSupervisor ? "60000000-0000-0000-0000-000000000001" : undefined,
        },
      });

      await drainOutbox().catch(() => {});
      if (!actingAsSupervisor) {
        setIsCheckedIn(kind === "check_in");
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Shift Overview Card */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--ink-3)] font-medium uppercase tracking-wider">Current Shift</span>
          <span className="text-xs font-semibold text-[var(--ok)] bg-[var(--ok-sunk)] px-2 py-0.5 rounded-full">
            Active Now
          </span>
        </div>
        <div className="text-xl font-bold mt-1 text-[var(--ink)] font-[family-name:var(--font-display)]">
          Day Shift (08:00 – 20:00)
        </div>
        <div className="text-xs text-[var(--ink-2)] mt-1 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[var(--ink-3)]" />
          <span>Shift started 4 hours ago • Riverside Mill</span>
        </div>
      </div>

      {submitted && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Attendance event recorded & synchronized!</span>
        </div>
      )}

      {/* Geofence & Location Card */}
      <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--ok)]" />
          <div>
            <div className="font-semibold text-[var(--ink)]">GPS Geofence: Inside</div>
            <div className="text-[10px] text-[var(--ink-3)]">Accurate to ±4.5m • Plot 14 Gate</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--ink-2)]">
          <Camera className="w-3.5 h-3.5 text-[var(--ok)]" />
          <span className="text-[11px]">Selfie Verified</span>
        </div>
      </div>

      {/* Primary Check-in/Check-out Control */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Your Attendance</h2>
          <span className={`text-xs font-bold ${isCheckedIn ? "text-[var(--ok)]" : "text-[var(--ink-3)]"}`}>
            {isCheckedIn ? "Checked In at 07:54 AM" : "Not Checked In"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant={isCheckedIn ? "secondary" : "primary"}
            className="h-12 text-xs font-semibold"
            disabled={submitting || isCheckedIn}
            onClick={() => handleToggleAttendance("check_in")}
          >
            Check In (Selfie)
          </Button>

          <Button
            variant={isCheckedIn ? "danger" : "secondary"}
            className="h-12 text-xs font-semibold"
            disabled={submitting || !isCheckedIn}
            onClick={() => handleToggleAttendance("check_out")}
          >
            Check Out (Shift End)
          </Button>
        </div>
      </div>

      {/* Supervisor Option: Mark Attendance for Workers Without Phone */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--ink)]">Supervisor Override</h3>
          </div>
          <button
            type="button"
            onClick={() => setActingAsSupervisor(!actingAsSupervisor)}
            className="text-xs font-medium text-[var(--primary)] hover:underline"
          >
            {actingAsSupervisor ? "Cancel" : "Mark Worker Attendance"}
          </button>
        </div>

        {actingAsSupervisor && (
          <div className="space-y-3 pt-2 border-t border-[var(--line)]">
            <p className="text-xs text-[var(--ink-3)]">
              PRD §14: For operators without a smartphone, supervisor marks attendance directly.
            </p>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">Select On-Duty Worker</label>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-[var(--ink)]"
              >
                <option value="60000000-0000-0000-0000-000000000002">Ali Asghar (Operator #EMP-002)</option>
                <option value="60000000-0000-0000-0000-000000000003">Zubair Khan (Night Operator #EMP-003)</option>
              </select>
            </div>

            <Button
              variant="primary"
              className="w-full h-10 text-xs font-semibold"
              disabled={submitting}
              onClick={() => handleToggleAttendance("check_in")}
            >
              Verify & Check In Worker
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
