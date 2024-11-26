anchor build

anchor deploy
cp -r target/idl/revvek_capstone.json app/src/lib/idl/revvek.json
cp -r target/types/revvek_capstone.ts app/src/lib/idl/revvek.ts
