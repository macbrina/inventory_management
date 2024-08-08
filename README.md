# StockSmart

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Packages Used](#packages-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

StockSmart is a modern inventory management system built using Next.js and various libraries. The application includes a range of features to help manage pantry items, suggest recipes based on available ingredients, and provide a comprehensive dashboard for analytics. It supports dark/light modes and integrates social authentication for easy sign-up and login.

## Features

- **AI Recipe Suggestions**: Get personalized recipe suggestions based on pantry items with interactive video tutorials.
- **Pantry Management**: Efficiently manage pantry items—add, edit, and delete ingredients.
- **Dashboard Analytics**: Access comprehensive analytics on pantry usage and recipe preferences.
- **Dark/Light Mode**: Toggle between light and dark themes for better user experience.
- **Social Authentication**: Sign in or sign up using Google or GitHub accounts.

## Installation

To get started with the project, clone the repository and install the required dependencies.

### Clone the Repository

```bash
git clone https://github.com/macbrina/inventory_management.git
cd inventory_management
```

### Install Dependencies

```bash
npm install
```

## Scripts

Here are the available scripts you can use:

- dev: Starts the development server.
- build: Builds the project for production.
- start: Starts the production server.
- lint: Lints the project files.

## Configuration

The project uses environment variables for configuration. Create a .env.local file in the root directory and add the following variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSENGER_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
OPENAI_API_KEY=your-openai-api-key
YOUTUBE_API_KEY=your-youtube-key
NODE_ENV=your-node-env
NEXT_PUBLIC_URL=your-web-url
```

## Packages Used

- Next.js: The React framework used for building the application.
- MUI (Material-UI): A popular React UI framework for building user interfaces.
- Firebase: Provides authentication and real-time database features.
- OpenAI: For AI-driven recipe suggestions.
- ApexCharts: For displaying charts and analytics.
- React Player: For embedding video tutorials.
- React Toastify: For showing notifications.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the GNU GENERAL PUBLIC [License](LICENSE).

## Contact

For any questions or feedback, please reach out to preciousmbaekwe@gmail.com.
