use std::process::{Command, Child};
use std::sync::{Arc, Mutex};
use tauri::{RunEvent};

fn spawn_flask() -> Child {
  
    Command::new("python")
        .arg("./server/app.py") // Adjust this path if needed
        .spawn()
        .expect("failed to start Flask server")
}

fn main() {
    let flask_process = Arc::new(Mutex::new(Some(spawn_flask())));

    let flask_process_clone = flask_process.clone();

    tauri::Builder::default()
        .build(tauri::generate_context!())
        .expect("error while running tauri app")
        .run(move |_app_handle, event| {
            if let RunEvent::Exit = event {
                if let Some( child) = flask_process_clone.lock().unwrap().take() {
                    #[cfg(target_os = "windows")]
                    {
                        // Force kill on Windows
                        let _ = Command::new("taskkill")
                            .args(&["/F", "/T", "/PID", &child.id().to_string()])
                            .output();
                    }

                    #[cfg(not(target_os = "windows"))]
                    {
                        // Standard kill on Unix systems
                        let _ = child.kill();
                    }
                }
            }
        });
}
