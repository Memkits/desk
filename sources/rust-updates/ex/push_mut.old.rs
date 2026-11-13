#[derive(Default)] struct Node { name: String, kids: Vec<u32> }
//>
fn add_node(tree: &mut Vec<Node>, name: &str) {
    tree.push(Node::default());
    let n = tree.last_mut().unwrap();   // 刚放进去，却还要 unwrap
    n.name = name.to_string();
    n.kids.push(0);
}
//<
fn main() { add_node(&mut vec![], "a"); }
