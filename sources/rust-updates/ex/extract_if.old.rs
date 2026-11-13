#[derive(Debug)] struct Task { done: bool }
//>
fn take_done(tasks: &mut Vec<Task>) -> Vec<Task> {
    let mut done = Vec::new();
    let mut i = 0;
    while i < tasks.len() {
        if tasks[i].done {
            done.push(tasks.remove(i));
        } else {
            i += 1;
        }
    }
    done
}
//<
fn main() { take_done(&mut vec![Task{done:true}]); }
