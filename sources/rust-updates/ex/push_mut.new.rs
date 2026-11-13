#[derive(Default)] struct Node { name: String, kids: Vec<u32> }
//>
fn add_node(tree: &mut Vec<Node>, name: &str) {
    let n = tree.push_mut(Node::default());
    n.name = name.to_string();
    n.kids.push(0);
}
//<
fn main() { add_node(&mut vec![], "a"); }
