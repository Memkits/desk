for f in ${@:-*.new.rs}; do n=${f%.rs}; n=${n//./_}; r=$(rustup run 1.100.0 rustc --edition 2024 --test --crate-name $n -o /tmp/$n $f 2>&1 | grep -E "^error" -A8 | head -14); [ -z "$r" ] && echo "OK  $f" || echo "ERR $f
$r"; done
