asciinema rec demo.cast

处理英文

agg --fps-cap 60 --font-size 24 --renderer=resvg demo.cast demo.gif

处理中文

cat demo.cast | perl -CS -pe 's/([\x{4e00}-\x{9fa5}]|[\x{FF00}-\x{FFEF}])/$1 /g' > demo.space.cast

agg --fps-cap 60 --font-size 24 --renderer=resvg demo.space.cast demo.gif
