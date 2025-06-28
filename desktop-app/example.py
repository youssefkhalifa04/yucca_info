import sys
import random
import os
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QLabel, QVBoxLayout, QHBoxLayout,
    QStackedWidget, QListWidget, QListWidgetItem, QFrame, QSizePolicy
)
from PyQt5.QtGui import QFont, QIcon, QPixmap
from PyQt5.QtCore import Qt, QTimer
import pyqtgraph as pg

# --- Sidebar Widget ---
class Sidebar(QListWidget):
    def __init__(self, parent):
        super().__init__()
        self.setFixedWidth(360)
        self.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.setStyleSheet("""
            QListWidget {
                           padding-left : 10px ;
                           padding-right : 10px ;
                background-color: #0f172a;
                color: #fff;
                border: none;
                font-size: 15px;
                font-family: 'Segoe UI';
            }
            QListWidget::item {
                padding: 16px 32 16px 32px;
                margin-bottom: 2px;
            }
            QListWidget::item:selected {
                background-color: #2563eb;
                border-radius: 8px;
                color: #fff;
            }
        """)
        ICON_DIR = os.path.join(os.path.dirname(__file__), "icons")
        items = [
            ("Dashboard", ""),
            ("Configuration", ""),
            ("Manual Control", ""),
            ("Automatic Mode", ""),
            ("Egg Types", ""),
            ("Logs & History", ""),
            ("Settings", ""),
        ]
        for text, icon in items:
            icon_path = os.path.join(ICON_DIR, icon)
            item = QListWidgetItem(QIcon(icon_path), text)
            self.addItem(item)
        self.currentRowChanged.connect(parent.change_page)

# --- Stat Card Widget ---
class StatCard(QFrame):
    def __init__(self, title, value, subtitle, icon_path):
        super().__init__()
        self.setStyleSheet("""
            QFrame {
                background-color: #fff;
                border-radius: 12px;
                border: none;
            }
        """)
        layout = QVBoxLayout()
        layout.setSpacing(6)
        title_label = QLabel(title)
        title_label.setFont(QFont("Segoe UI", 10))
        layout.addWidget(title_label)

        hbox = QHBoxLayout()
        value_label = QLabel(value)
        value_label.setFont(QFont("Segoe UI", 22, QFont.Bold))
        hbox.addWidget(value_label)
        hbox.addStretch()
        icon = QLabel()
        icon.setPixmap(QPixmap(icon_path).scaled(22, 22, Qt.KeepAspectRatio, Qt.SmoothTransformation))
        hbox.addWidget(icon)
        layout.addLayout(hbox)

        subtitle_label = QLabel(subtitle)
        subtitle_label.setFont(QFont("Segoe UI", 9))
        subtitle_label.setStyleSheet("color: #6b7280;")
        layout.addWidget(subtitle_label)
        self.setLayout(layout)

# --- System Status Card ---
class SystemStatusCard(QFrame):
    def __init__(self, status_list):
        super().__init__()
        self.setStyleSheet("""
            QFrame {
                background-color: #fff;
                border-radius: 12px;
                padding: 18px;
                border: none;
            }
        """)
        layout = QVBoxLayout()
        title = QLabel("System Status")
        title.setFont(QFont("Segoe UI", 13, QFont.Bold))
        layout.addWidget(title)
        for name, icon_path, on in status_list:
            row = QHBoxLayout()
            icon = QLabel()
            icon.setPixmap(QPixmap(icon_path).scaled(22, 22, Qt.KeepAspectRatio, Qt.SmoothTransformation))
            label = QLabel(name)
            label.setFont(QFont("Segoe UI", 11))
            indicator = QLabel("●")
            indicator.setStyleSheet(f"color: {'#22c55e' if on else '#d1d5db'}; font-size: 18px;")
            status = QLabel("ON" if on else "OFF")
            status.setStyleSheet(f"color: {'#22c55e' if on else '#6b7280'}; font-weight: bold; font-size: 12px;")
            row.addWidget(icon)
            row.addWidget(label)
            row.addStretch()
            row.addWidget(indicator)
            row.addWidget(status)
            layout.addLayout(row)
        self.setLayout(layout)

# --- Dashboard Page ---
class DashboardPage(QWidget):
    def __init__(self):
        super().__init__()
        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)

        # Stat cards
        stat_cards = QHBoxLayout()
        stat_cards.setSpacing(18)
        ICON_DIR = os.path.join(os.path.dirname(__file__), "icons")
        stat_cards.addWidget(StatCard("Temperature", "38.3°C", "Target: 37.5°C", os.path.join(ICON_DIR, "temperature.png")))
        stat_cards.addWidget(StatCard("Humidity", "62.2%", "Target: 60%", os.path.join(ICON_DIR, "humidity.png")))
        stat_cards.addWidget(StatCard("Incubation Day", "Day 12", "9 days remaining", os.path.join(ICON_DIR, "egg.png")))
        stat_cards.addWidget(StatCard("Next Rotation", "45 min", "Every 2 hours", os.path.join(ICON_DIR, "rotation.png")))
        main_layout.addLayout(stat_cards)

        # Chart and System Status
        mid_layout = QHBoxLayout()
        mid_layout.setSpacing(18)

        # Chart Card
        chart_card = QFrame()
        chart_card.setStyleSheet("background-color: #fff; border-radius: 12px; padding: 18px; border: none;")
        chart_layout = QVBoxLayout()
        chart_title = QLabel("Temperature & Humidity Trends")
        chart_title.setFont(QFont("Segoe UI", 14, QFont.Bold))
        chart_layout.addWidget(chart_title)

        self.graph = pg.PlotWidget()
        self.graph.setBackground('w')
        self.graph.showGrid(x=True, y=True)
        self.graph.setYRange(0, 80)
        self.temp_line = self.graph.plot(pen=pg.mkPen('#ef4444', width=2))
        self.hum_line = self.graph.plot(pen=pg.mkPen('#2563eb', width=2))
        chart_layout.addWidget(self.graph)
        chart_card.setLayout(chart_layout)
        chart_card.setMinimumWidth(700)
        mid_layout.addWidget(chart_card, 3)

        # System Status Card
        status_list = [
            ("Circulation Fan", os.path.join(ICON_DIR, "fan.png"), True),
            ("Water Valve", os.path.join(ICON_DIR, "water.png"), False),
            ("Rotation Motor", os.path.join(ICON_DIR, "motor.png"), True),
            ("Heater Element", os.path.join(ICON_DIR, "heater.png"), False),
        ]
        mid_layout.addWidget(SystemStatusCard(status_list), 1)

        main_layout.addSpacing(18)
        main_layout.addLayout(mid_layout)
        self.setLayout(main_layout)

        # Chart data
        self.temp_data = []
        self.hum_data = []
        self.time = list(range(50))
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_chart)
        self.timer.start(2000)

    def update_chart(self):
        if len(self.temp_data) >= 50:
            self.temp_data.pop(0)
            self.hum_data.pop(0)
        self.temp_data.append(37 + random.uniform(-0.5, 0.5))
        self.hum_data.append(60 + random.uniform(-2, 2))
        self.temp_line.setData(self.time[:len(self.temp_data)], self.temp_data)
        self.hum_line.setData(self.time[:len(self.hum_data)], self.hum_data)

# --- Main Window ---
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Egg Incubator Control")
        self.setMinimumSize(1400, 850)
        self.setStyleSheet("background-color: #f3f4f6;")

        # Central widget
        container = QWidget()
        main_layout = QHBoxLayout(container)
        main_layout.setContentsMargins(0, 0, 0, 0)

        # Sidebar
        sidebar_layout = QVBoxLayout()
        sidebar_layout.setContentsMargins(0, 0, 0, 0)
        sidebar_layout.setSpacing(0)

        # App title
        title = QLabel("Egg Incubator")
        title.setFont(QFont("Segoe UI", 16, QFont.Bold))
        title.setStyleSheet("color: #fff; margin-top: 32px; margin-left: 24px;")
        subtitle = QLabel("Professional Edition")
        subtitle.setFont(QFont("Segoe UI", 10))
        subtitle.setStyleSheet("color: #cbd5e1; margin-left: 24px; margin-bottom: 24px;")
        sidebar_layout.addWidget(title)
        sidebar_layout.addWidget(subtitle)

        # Sidebar menu
        self.sidebar = Sidebar(self)
        sidebar_layout.addWidget(self.sidebar)

        # Spacer
        sidebar_layout.addStretch()

        # USB Connected
        usb = QLabel("● USB Connected")
        usb.setFont(QFont("Segoe UI", 10))
        usb.setStyleSheet("color: #22c55e; margin-left: 24px; margin-bottom: 18px;")
        sidebar_layout.addWidget(usb)

        sidebar_widget = QWidget()
        sidebar_widget.setLayout(sidebar_layout)
        sidebar_widget.setFixedWidth(240)
        sidebar_widget.setStyleSheet("background-color: #0f172a;")

        main_layout.addWidget(sidebar_widget)

        # Main content area
        content_layout = QVBoxLayout()
        content_layout.setContentsMargins(32, 24, 32, 24)
        content_layout.setSpacing(0)

        # Header
        header_layout = QHBoxLayout()
        header_label = QLabel("Dashboard")
        header_label.setFont(QFont("Segoe UI", 28, QFont.Bold))
        header_label.setStyleSheet("color: #1e293b;")
        header_layout.addWidget(header_label)
        header_layout.addStretch()
        live = QLabel("● Live Monitoring Active")
        live.setFont(QFont("Segoe UI", 12))
        live.setStyleSheet("color: #22c55e; margin-right: 12px;")
        header_layout.addWidget(live)
        content_layout.addLayout(header_layout)
        content_layout.addSpacing(18)

        # Pages
        self.stack = QStackedWidget()
        self.stack.addWidget(DashboardPage())
        self.stack.addWidget(QLabel("Configuration Page"))
        self.stack.addWidget(QLabel("Manual Control Page"))
        self.stack.addWidget(QLabel("Automatic Mode Page"))
        self.stack.addWidget(QLabel("Egg Types Page"))
        self.stack.addWidget(QLabel("Logs & History Page"))
        self.stack.addWidget(QLabel("Settings Page"))
        content_layout.addWidget(self.stack)

        content_widget = QWidget()
        content_widget.setLayout(content_layout)
        main_layout.addWidget(content_widget)

        self.setCentralWidget(container)

    def change_page(self, index):
        self.stack.setCurrentIndex(index)

# --- Main ---
if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setFont(QFont("Segoe UI", 10))
    win = MainWindow()
    win.show()
    sys.exit(app.exec_())
