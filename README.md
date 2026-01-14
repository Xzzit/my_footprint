# My Footprint Map 🌍
A lightweight, interactive timeline map built with HTML, CSS, and JavaScript (Leaflet.js). This project visualizes a personal life journey, automatically handling camera transitions and animations based on locations.

## 🌏 Live Demo
Experience the interactive map online: **[https://xzzit.github.io/my_footprint/](https://xzzit.github.io/my_footprint/)**

## 🚀 Quick Start
1. Open your terminal/command prompt in the project directory.

2. Start a simple Python HTTP server:

```bash
python -m http.server
```

3. Open your browser and visit:

```bash
http://localhost:8000
```

## 📝 Data Configuration (data.json)
To customize the timeline, edit the data.json file. It consists of an array of event objects.

Example:

```json
[
  {
    "date": "1997-09-28",
    "title": "Birth",
    "description": "Born in Shiyan, Hubei. The journey begins.",
    "coordinates": [32.6306, 110.7928],
    "zoom": 7,
    "type": ""
  },
  {
    "date": "2003-09",
    "title": "Primary School",
    "description": "Entered Renmin Primary School.",
    "coordinates": [32.6333, 110.7818],
    "zoom": 14,
    "type": ""
  }
]
```

| Field | Description / Visual Effect |
| :--- | :--- |
| **date** | Displayed at the top of the popup (e.g., "1997-09" or "Spring 2023"). |
| **title** | The main bold header in the popup. |
| **description** | Detailed text body below the title. |
| **coordinates** | The geographic location.<br>_Tip: Right-click on Google Maps to copy Lat, Lng directly._ |
| **zoom** | Controls camera height.<br>• **Low (4-7):** Country/Province view (Far).<br>• **High (14-16):** Street/Building view (Close). |
| **type** | **Archive Chapter / Era Name**. Defines the category for the top-right "Archive Menu". <br>⚠️ **Note:** Only assign this to the *first* event of a new period (Sparse Indexing). Leave empty for others. |