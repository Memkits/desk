# 旧写法用 1.84（2021 版次），新写法用 1.100（2024 版次）编译；-D warnings 以外的警告忽略
for f in ${@:-*.old.rs}; do n=${f%.rs}; n=${n//./_}; r=$(rustup run 1.84.0 rustc --edition 2021 --test --crate-name $n -o /tmp/$n $f 2>&1 | grep -E "^error" -A8 | head -14); [ -z "$r" ] && echo "OK  $f" || echo "ERR $f
$r"; done
