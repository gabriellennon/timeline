# Timeline Visualization (React assessment)

A React app for visualizing items on a timeline with compact lane arrangement.

## Features

- Horizontal timeline with compact lane arrangement
- Zoom in/out functionality
- Drag and drop to change item dates
- Inline editing of item names
- Month and date indicators
- Responsive design
- Light/Dark Theme Toggle
- Smooth Animations
- Modern 3D Background

### What I Like About My Implementation

- **Compact Lane Algorithm**: The implementation efficiently arranges items in lanes, ensuring that items that don't overlap in time can share the same lane.
- **Interactive Features**: The timeline supports zooming, dragging to adjust dates, and inline editing, making it a fully interactive component.
- **Visual Clarity**: The timeline provides clear visual cues with month labels and appropriate spacing.
- **Responsive Design**: The component adapts to different screen sizes while maintaining usability.
- **Theme Support**: The component fully supports light and dark themes with appropriate color adjustments.
- **Modern UI**: The 3D background and animations create a visually appealing and modern user experience.

### What I Would Change

- **Performance Optimization**: For large datasets, I would implement virtualization to render only visible items.
- **Accessibility**: I would enhance keyboard navigation and screen reader support.
- **Date Handling**: I would add more robust date validation and handling of edge cases.
- **State Management**: For a larger application, I might move state management to a context or Redux for better organization.
- **3D Background Optimization**: Further optimize the 3D background for better performance on lower-end devices.

## How to Run

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Run the development server: \`npm start\`
4. Open [http://localhost:1234](http://localhost:1234) in your browser

## Technologies Used

- React
- date-fns for date manipulation
- Tailwind CSS for styling
- Framer Motion for animations
- Three.js for 3D background
- Radix UI for accessible UI components
\`\`\`
