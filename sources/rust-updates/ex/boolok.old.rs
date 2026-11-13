struct Ticket { paid: bool } #[derive(Debug)] struct NotPaid;
//>
fn check(t: &Ticket) -> Result<(), NotPaid> {
    if t.paid { Ok(()) } else { Err(NotPaid) }
}

fn label(nick: Option<&str>) -> String {
    nick.map(|s| s.to_uppercase()).unwrap_or_default()
}
//<
fn main() { let _ = check(&Ticket{paid:true}); label(None); }
