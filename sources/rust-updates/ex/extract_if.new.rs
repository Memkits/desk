#[derive(Debug)] struct Task { done: bool }
//>
fn take_done(tasks: &mut Vec<Task>) -> Vec<Task> {
    tasks.extract_if(.., |t| t.done).collect()
}
//<
fn main() { take_done(&mut vec![Task{done:true}]); }
