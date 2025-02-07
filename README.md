# 📱 MyVelocity

**MyVelocity** is a mobile app built with React Native that detects the current speed state of the device using the accelerometer. The app classifies speed states and provides real-time updates through a clean and simple interface.

---

## 🔖 **Features**
- 🔍 Real-time speed detection using the device's built-in accelerometer.
- 🚦 Classification of speed states, including:
  - **Stopped:** 0 km/h - 1 km/h  
  - **Walking:** 1 km/h - 4 km/h  
  - **Marching:** 4 km/h - 6 km/h  
  - **Running:** 6 km/h - 12 km/h  
  - **Sprinting:** 12 km/h - 25 km/h  
  - **Land Motor Vehicle:** 25 km/h - 170 km/h  
  - **Air Motor Vehicle:** Over 170 km/h  
- 🔄 Built-in state transition logic for smooth updates.

---

## 🛠️ **Tech Stack**
- **React Native**: For cross-platform mobile development.
- **Expo**: To streamline the development and build process.
- **TypeScript**: For type safety and maintainability.

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js (latest stable version)
- Expo CLI installed globally:
  ```bash
  npm install -g expo-cli
  ```

### Installation
1. Clone the repository:
   ```bash
   git clone    https://github.com/antonioap101/MyVelocity.git
   cd myvelocity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   expo start
   ```

4. Scan the QR code with the **Expo Go** app (available on iOS and Android) to run the app on your device.

---

## 📥 **Building the APK**
To generate the APK, follow these steps:

1. Install **EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. Configure the project for EAS builds:
   ```bash
   eas build:configure
   ```

3. Build the APK:
   ```bash
   eas build -p android
   ```

After completion, you can download the APK from Expo.

---

## 📢 **Future Improvements**
- Customizable state transitions.
- Speed logging and export capabilities.
- Enhanced UI/UX with dynamic indicators.

---

## 🏷️ **License**
This project is licensed under the GNU General Public License v3.0 License. See the [LICENSE](LICENSE) file for details.


