const COMMANDS: &[&str] = &[
    "list_distributors",
    "set_distributor",
    "register_for_push_notifications",
    "unregister_for_push_notifications",
    "set_token",
    "register_listener",
    "remove_listener",
    "get_saved_distributor",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .try_build()
        .expect("Failed to build Tauri plugin");
}
