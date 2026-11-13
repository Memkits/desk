struct Ticket { paid: bool } #[derive(Debug)] struct NotPaid;
//>
fn check(t: &Ticket) -> Result<(), NotPaid> {
    t.paid.ok_or(NotPaid)
}

fn label(nick: Option<&str>) -> String {
    nick.map_or_default(|s| s.to_uppercase())
}
//<
fn main() { let _ = check(&Ticket{paid:true}); label(None); }
