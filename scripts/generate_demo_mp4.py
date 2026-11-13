#!/usr/bin/env python3
"""
MechMate AI - Automated 3-Minute Demo MP4 Video Generator
Creates a 1080p 60fps presentation video matching the official 3-minute hackathon script.
Uses standard FFmpeg to generate slides, typography, and subtitle overlays.
"""

import os
import subprocess
import sys

OUTPUT_DIR = "public/demo"
FINAL_OUTPUT = os.path.join(OUTPUT_DIR, "MechMate_AI_Demo_3Min.mp4")
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

SCENES = [
    {
        "id": "scene1_hook",
        "duration": 20,
        "title": "MECHMATE AI",
        "subtitle": "Predict · Prevent · Protect | Industrial & Aerospace Machine Intelligence",
        "bullets": [
            "Problem: $50B+ Lost Annually to Unplanned Machine Downtime",
            "Reactive Maintenance Fails When Seconds Count",
            "Deep Space Challenge: 8 to 44 Min Round-Trip Latency Precludes Earth Intervention",
            "Solution: Autonomous Multi-Agent Machine Intelligence & 3D Spatial Twins"
        ],
        "narration": "Every year, unexpected machine breakdowns cost industrial manufacturers and space missions billions. When machines fail, operations stop. Welcome to MechMate AI."
    },
    {
        "id": "scene2_3d_fleet",
        "duration": 30,
        "title": "DYNAMIC THREE.JS 3D DIGITAL TWINS",
        "subtitle": "Instant Physics CAD Reconstruction for Aerospace & Industrial Fleets",
        "bullets": [
            "NASA ISAAC: 6-Axis Robotic AFP Cell & Laser Consolidation Head",
            "ISS Refabricator: In-Orbit Zero-G Polymer Recycler & Extruder",
            "NASA EBF3: High-Vacuum 60kV Electron Beam Freeform Metal Deposition",
            "Standard Industrial: 5-Axis CNC Milling, Slant-Bed Lathes, VMC Centers & Powertrains"
        ],
        "narration": "Selecting any machine from our aerospace or industrial fleet instantly loads its true 3D digital twin in Three.js with full cross-section and thermal inspection."
    },
    {
        "id": "scene3_iso_telemetry",
        "duration": 30,
        "title": "REAL-TIME TELEMETRY & ISO 20816 PHYSICS",
        "subtitle": "Deterministic Acoustic, Thermal, and Kinetic Multi-Agent Diagnostic Consensus",
        "bullets": [
            "Multi-Sensor Ingestion: RMS Vibration Velocity, Temperature, Speed, Load, Oil Index",
            "ISO 20816 & ISO 10816 Machine Vibration Severity Zones (A, B, C, D)",
            "Multi-Agent AI Reasoner: Isolates Root-Cause Bearing, Pinion, and Coupling Candidates",
            "Zero Black-Box Guesswork: Physics Equations Guide Every Anomaly Assessment"
        ],
        "narration": "MechMate AI streams real-time telemetry benchmarked against ISO vibration standards, isolating component wear before catastrophic failure strikes."
    },
    {
        "id": "scene4_simulation",
        "duration": 35,
        "title": "WHAT-IF SIMULATION LAB",
        "subtitle": "Stress-Testing Operating Envelopes & Predicting Component Fatigue",
        "bullets": [
            "Interactive RPM, Mechanical Load, and Lubricant Temperature Stress Sliders",
            "Real-Time Torque Recalculation: T = 9550 * P / N (Nm)",
            "Torsional Shear Stress (tau = 16T / pi*d^3) and Safety Factor Analysis",
            "Dynamic Bearing L10h MTBF Life Prediction Before Committing Physical Hardware"
        ],
        "narration": "In the What-If Simulation Lab, engineers can simulate extreme operating envelopes, calculating dynamic torque, shear stress, and bearing life in real time."
    },
    {
        "id": "scene5_copilot_pdf",
        "duration": 35,
        "title": "AI COPILOT & 1-CLICK ISO 17359 AUDIT PDF",
        "subtitle": "Grounded Technical Procedures & Instant Certified Engineering Documentation",
        "bullets": [
            "Embedded AI Engineering Copilot Trained on Original Equipment Standards",
            "Root-Cause Explanations, Mitigation Workflows, and SKF Bearing Part Lookups",
            "1-Click ISO 17359 Diagnostic PDF Report Generation",
            "Includes Mathematical Proofs, Telemetry Snapshots, and Technician Sign-Off Tables"
        ],
        "narration": "Our embedded AI Copilot provides step-by-step mitigation workflows, while the 1-Click Diagnostic PDF exports certified ISO 17359 audit reports ready for compliance."
    },
    {
        "id": "scene6_conclusion",
        "duration": 30,
        "title": "PREDICT · PREVENT · PROTECT",
        "subtitle": "Live & Operational for Global Industrial Fleets and Space Missions",
        "bullets": [
            "Continuous 24/7 Mechanical Health Monitoring & Asset Preservation",
            "Built with Modern Web Stack: React, TypeScript, Three.js, Tailwind CSS, Express",
            "Ready for Deep-Space Edge Deployment & Industrial IoT Shopfloors",
            "Try MechMate AI Live: https://ais-pre-ou53d6lb6b6aqbccju2w5p-844473000899.asia-southeast1.run.app"
        ],
        "narration": "From the International Space Station to precision shopfloors, MechMate AI transforms raw sensor streams into proactive intelligence. Thank you."
    }
]

def render_scene(scene, index, temp_dir):
    clip_path = os.path.join(temp_dir, f"clip_{index:02d}.mp4")
    dur = scene["duration"]
    def clean(t):
        return t.replace(":", "\\:").replace("'", "").replace("%", "\\%")

    title = clean(scene["title"])
    subtitle = clean(scene["subtitle"])
    narration = clean(scene["narration"])
    
    b0 = clean(scene["bullets"][0])
    b1 = clean(scene["bullets"][1])
    b2 = clean(scene["bullets"][2])
    b3 = clean(scene["bullets"][3])

    # Build FFmpeg filter chain for rich 1080p slide with glowing styling
    filter_chain = (
        f"drawbox=x=80:y=60:w=1760:h=960:color=0x0D1B2A@0.85:t=fill,"
        f"drawbox=x=80:y=60:w=1760:h=960:color=0x00D2FF@0.4:t=3,"
        f"drawbox=x=80:y=60:w=1760:h=120:color=0x07111E@0.95:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='MECHMATE AI':fontcolor=0x00E599:fontsize=26:x=110:y=80,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{title}':fontcolor=0xFFFFFF:fontsize=46:x=110:y=115,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='{subtitle}':fontcolor=0x5CE1E6:fontsize=24:x=110:y=210,"
        f"drawtext=fontfile='{FONT_BOLD}':text='KEY CAPABILITIES:':fontcolor=0x00E599:fontsize=22:x=110:y=280,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='* {b0}':fontcolor=0xFFFFFF:fontsize=28:x=130:y=340,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='* {b1}':fontcolor=0xFFFFFF:fontsize=28:x=130:y=420,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='* {b2}':fontcolor=0xFFFFFF:fontsize=28:x=130:y=500,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='* {b3}':fontcolor=0xFFFFFF:fontsize=28:x=130:y=580,"
        f"drawbox=x=80:y=860:w=1760:h=160:color=0x050C16@0.9:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='NARRATION:':fontcolor=0x00D2FF:fontsize=20:x=110:y=880,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='\"{narration}\"':fontcolor=0xCCCCCC:fontsize=24:x=110:y=920"
    )

    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x060B12:s=1920x1080:d={dur}:r=30",
        "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo",
        "-vf", filter_chain,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast",
        "-c:a", "aac", "-b:a", "128k", "-shortest",
        clip_path
    ]
    
    print(f"[*] Rendering Scene {index + 1}/{len(SCENES)}: {title} ({dur}s)...")
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if res.returncode != 0:
        print(f"[!] Error in Scene {index}:", res.stderr.decode()[-300:])
        sys.exit(1)
    return clip_path

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    temp_dir = "/tmp/mechmate_video_parts"
    os.makedirs(temp_dir, exist_ok=True)

    clips = []
    for i, sc in enumerate(SCENES):
        clip = render_scene(sc, i, temp_dir)
        clips.append(clip)

    # Concat file list
    list_path = os.path.join(temp_dir, "clips.txt")
    with open(list_path, "w") as f:
        for c in clips:
            f.write(f"file '{c}'\n")

    print("[*] Concatenating all scenes into final 3-minute 1080p MP4...")
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", list_path,
        "-c", "copy",
        FINAL_OUTPUT
    ]
    subprocess.run(concat_cmd, check=True)
    size_mb = os.path.getsize(FINAL_OUTPUT) / (1024 * 1024)
    print(f"[SUCCESS] Video rendered successfully at: {FINAL_OUTPUT} ({size_mb:.2f} MB)")
    print(f"Total Video Runtime: 180 seconds (3:00 minutes)")

if __name__ == "__main__":
    main()
