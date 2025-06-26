from PyQt5.QtWidgets import (
    QApplication, QWidget, QLabel, QPushButton, QGroupBox, QVBoxLayout, QHBoxLayout,
    QFormLayout, QDoubleSpinBox, QSpinBox, QComboBox, QTextBrowser, QLCDNumber,
    QStatusBar, QMainWindow, QGridLayout
)
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QFont, QColor, QPalette
import sys


class IncubatorApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Supervision Incubateur d'Oeufs")
        self.setGeometry(100, 100, 1000, 700)

        # Apply professional modern dark theme
        self.setStyleSheet("""
            QWidget {
                background-color: #181c20;
                color: #e0e6ed;
                font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
                font-size: 15px;
            }
            QGroupBox {
                border: 1.5px solid #2d3748;
                border-radius: 12px;
                margin-top: 18px;
                background-color: #23272f;
                padding: 12px 10px 10px 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 18px;
                padding: 0 8px 0 8px;
                color: #00ffd5;
                font-size: 17px;
                font-weight: bold;
            }
            QPushButton {
                background-color: #222c36;
                border: 1.5px solid #00ffd5;
                padding: 10px 18px;
                border-radius: 8px;
                font-size: 15px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.2s, color 0.2s;
            }
            QPushButton:hover {
                background-color: #00ffd5;
                color: #181c20;
                border: 1.5px solid #00ffd5;
                cursor: pointer;
            }
            QLabel, QComboBox, QTextBrowser {
                padding: 4px;
            }
            QLCDNumber {
                background-color: #181c20;
                color: #00ffae;
                border: 1.5px solid #2d3748;
                border-radius: 6px;
                margin: 2px 0;
            }
            QTextBrowser {
                background: #23272f;
                border-radius: 8px;
                border: 1.5px solid #2d3748;
                min-height: 60px;
            }
            QStatusBar {
                background: #23272f;
                color: #00ffd5;
                border-top: 1.5px solid #2d3748;
                font-size: 14px;
            }
            QComboBox {
                background: #23272f;
                border-radius: 6px;
                border: 1.5px solid #2d3748;
            }
            QSpinBox, QDoubleSpinBox {
                background: #23272f;
                border-radius: 6px;
                border: 1.5px solid #2d3748;
                color: #e0e6ed;
                padding: 4px 8px;
            }
        """)
        # il main layout hiye page il bech tit7al ya3ni il main window 
        # Main layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QVBoxLayout(main_widget)
        #ay groupbox houwa 3ibara 3ala div = container lil les composant ili fi wistou
        # Supervision Group | line just na3mlou f initialisation les les labels wil inputs 
        self.supervision_group = QGroupBox("Supervision en Temps Réel")
        sup_layout = QGridLayout()
        self.temp_display = QLCDNumber()
        self.hum_display = QLCDNumber()
        self.fan_status = QLabel("Ventilateur: OFF")
        self.valve_status = QLabel("Électrovanne: OFF")
        self.motor_status = QLabel("Moteur: OFF")
        # just na3mlou fil ta9sim ta3 il grid linne 
        sup_layout.addWidget(QLabel("Température actuelle"), 0, 0)  # a7ne 3mlne grid 2*4 ya3ni ken ni7sbouha matrice kol label wlaa input bch ykou 3andhe cordoneé fil matrice ili houma bch ykounou (x,y)
        sup_layout.addWidget(self.temp_display, 0, 1)
        sup_layout.addWidget(QLabel("Humidité actuelle"), 1, 0)
        sup_layout.addWidget(self.hum_display, 1, 1)
        sup_layout.addWidget(self.fan_status, 2, 0)
        sup_layout.addWidget(self.valve_status, 2, 1)
        sup_layout.addWidget(self.motor_status, 3, 0)
        self.supervision_group.setLayout(sup_layout)

        # Configuration Group
        self.config_group = QGroupBox("Configuration des Seuils")
        config_layout = QFormLayout()  # form like usual fil html na3mlou fih recupération lil les donné ta3ne
        self.temp_high = QDoubleSpinBox()
        self.temp_low = QDoubleSpinBox()
        self.hum_min = QSpinBox()
        self.rotation_interval = QSpinBox()
        self.send_config_btn = QPushButton("Envoyer")
        config_layout.addRow("Température haute", self.temp_high)
        config_layout.addRow("Température basse", self.temp_low)
        config_layout.addRow("Humidité minimale", self.hum_min)
        config_layout.addRow("Intervalle rotation (min)", self.rotation_interval)
        config_layout.addRow(self.send_config_btn)
        self.config_group.setLayout(config_layout)

        # Manual Control Group
        self.manual_group = QGroupBox("Contrôle Manuel")
        manual_layout = QVBoxLayout()
        self.fan_btn = QPushButton("Ventilateur ON/OFF")
        self.valve_btn = QPushButton("Électrovanne ON/OFF")
        self.left_btn = QPushButton("Tourner à gauche")
        self.right_btn = QPushButton("Tourner à droite")
        manual_layout.addWidget(self.fan_btn)
        manual_layout.addWidget(self.valve_btn)
        manual_layout.addWidget(self.left_btn)
        manual_layout.addWidget(self.right_btn)
        self.manual_group.setLayout(manual_layout)

        # Mode Group
        self.mode_group = QGroupBox("Mode de Fonctionnement")
        mode_layout = QVBoxLayout()
        self.mode_btn = QPushButton("Activer Mode Automatique")
        self.mode_label = QLabel("Mode: MANUEL")
        mode_layout.addWidget(self.mode_btn)
        mode_layout.addWidget(self.mode_label)
        self.mode_group.setLayout(mode_layout)

        # Egg Type Group
        self.egg_group = QGroupBox("Type d'œuf")
        egg_layout = QVBoxLayout()
        self.egg_selector = QComboBox()
        self.egg_selector.addItems(["Poulet", "Caille", "Canard", "Dinde"])
        self.load_egg_btn = QPushButton("Charger paramètres")
        egg_layout.addWidget(self.egg_selector)
        egg_layout.addWidget(self.load_egg_btn)
        self.egg_group.setLayout(egg_layout)

        # Log Viewer
        self.log_browser = QTextBrowser()

        # Layout packing (add spacing between groups for a professional look)
        main_layout.addWidget(self.supervision_group)
        main_layout.addSpacing(10)
        main_layout.addWidget(self.config_group)
        main_layout.addSpacing(10)
        main_layout.addWidget(self.manual_group)
        main_layout.addSpacing(10)
        main_layout.addWidget(self.mode_group)
        main_layout.addSpacing(10)
        main_layout.addWidget(self.egg_group)
        main_layout.addSpacing(10)
        main_layout.addWidget(QLabel("Journalisation"))
        main_layout.addWidget(self.log_browser)

        # Status Bar
        self.status = QStatusBar()
        self.setStatusBar(self.status)
        self.status.showMessage("Port: COM3 | Refresh: 2s")

        # Timer placeholder
        self.timer = QTimer()
        self.timer.start(2000)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    win = IncubatorApp()
    win.show()
    sys.exit(app.exec_())