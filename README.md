# Student Attendance Management

This project allows students to register for the lecture they are attending using GeoLocation within 100 meters of the lecture room.

## Features

- Student registration
- GeoLocation verification within a 100-meter radius
- Lecture attendance tracking

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/OLEMUKAN/Student-Attendance-Management.git
    ```

2. Navigate to the project directory:

    ```sh
    cd Student-Attendance-Management
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

4. Set up environment variables (e.g., database configuration, GeoLocation API keys) in a `.env` file:

    ```sh
    touch .env
    ```

    Add the following variables to the `.env` file:

    ```env
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASS=your_database_password
    GEO_API_KEY=your_geolocation_api_key
    ```

5. Run the application:

    ```sh
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register as a student.
3. The system will verify your GeoLocation to ensure you are within 100 meters of the lecture room.
4. Once verified, you can mark your attendance for the lecture.

## Contributing

1. Fork the repository.
2. Create a new branch:

    ```sh
    git checkout -b feature-branch-name
    ```

3. Make your changes.
4. Commit your changes:

    ```sh
    git commit -m "Description of changes"
    ```

5. Push to the branch:

    ```sh
    git push origin feature-branch-name
    ```

6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.