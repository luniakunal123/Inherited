VAR player_name = "Rahul"
VAR can_call_home = false
VAR is_mahesh = false
VAR current_act = 1
VAR chose_kind_option = false
VAR composure = 100
VAR energy = 80
VAR stress = 30

-> act1_screen1

=== act1_screen1 ===
# character:none
# image:Act1
The results are out.
[BREAK]
-> act1_screen2

=== act1_screen2 ===
# character:rahul_teen_neutral
# image:Act1
{player_name}, you are 16.
Your phone is face-down on the desk.
You put it there twenty minutes ago and haven't touched it since.
Everyone around you already knows.
[BREAK]
-> act1_choice

=== act1_choice ===
# character:rahul_teen_tense
# image:Act2
Rohan got 91. He told you without being asked.
What do you do?

* [Turn it over and look]
    -> act1_choice_option1

* [Ask Rohan to check for you]
    -> act1_choice_option2

* [Put it in your bag. You'll look at home.]
    -> act1_choice_option3

* [LOCKED: Call home. Tell them before you see it yourself.]
    -> act1_choice

=== act1_choice_option1 ===
# character:rahul_teen_tense
# image:Option1
57 out of 100.
You read it three times.
[BREAK]
-> act1_end

=== act1_choice_option2 ===
# character:rahul_teen_tense
# image:Option2
Rohan reads it for you.
57 out of 100.
He says the number with a kind face.
That somehow makes it worse.
[BREAK]
-> act1_end

=== act1_choice_option3 ===
# character:rahul_teen_tense
# image:Option3
It will still be the same number at home.
You know this.
You put the phone in your bag anyway.
[BREAK]
-> act1_end

=== act1_end ===
# character:none
# background:black
-> act1_to_act2

=== act1_to_act2 ===
# character:none
# background:fade_grey
[BREAK]
-> act2_screen1

=== act2_screen1 ===
# character:rahul_child_neutral
# background:home_entrance_evening
The floor is cold under your feet.
That's the first thing.
You are sitting outside the kitchen because Mummy said wait there,
and you are waiting,
and through the door you can hear the phone being put down.
Papa is home early.
He is never home early.
[BREAK]
-> act2_screen2

=== act2_screen2 ===
# character:rahul_child_neutral
# background:home_entrance_evening
You are eight years old.
Your class test came back today.
64 out of 100.
You don't know yet that this number will live in this house for the next three weeks.
You only know that it is in your bag and your bag is in the other room and Papa's chappals are at the door.
[BREAK]
-> act2_choice1

=== act2_choice1 ===
# character:rahul_child_tense
# background:home_entrance_evening
Mummy comes out of the kitchen.
She sees your face.
She already knows something happened at school —
teachers have a way of calling before the children get home.
She doesn't say anything yet.
She just looks at you.

* [Tell her before Papa sees]
    ~ stress = stress + 10
    You say the number out loud.
    It sounds smaller when you say it.
    -> act2_papa_calls

* [Ask her what Papa already knows]
    ~ stress = stress + 15
    She looks at the kitchen door.
    That's her answer.
    -> act2_papa_calls

* [Say nothing. Wait.]
    ~ stress = stress + 20
    The waiting is its own answer.
    -> act2_papa_calls

* [PERMANENT: Ask her to sit with you when you tell him.]
    -> act2_choice1

=== act2_papa_calls ===
# character:rahul_child_tense
# background:home_entrance_evening
Papa's voice comes from the other room.
"{player_name}."
Just your name. Nothing else.
You have learned to read everything in the way he says it.
Tonight it means: I already know.
Tonight it means: come here.
[BREAK]
-> act2_living_room

=== act2_living_room ===
# character:rahul_child_fear
# background:living_room_night
The living room feels smaller at night.
Papa is in his chair.
He hasn't changed out of his office clothes yet.
That means he came straight to this.
The test paper is on the arm of the chair.
You don't know how it got there.
Your bag was in the other room.
He doesn't look angry.
That's the thing nobody tells you —
it's worse when they don't look angry.
He just looks tired.
And like you made him that way.
[BREAK]
-> act2_choice2

=== act2_choice2 ===
# character:rahul_child_fear
# background:living_room_night
He picks up the paper.
He holds it the way you'd hold something you found in the drain.
64.
He says the number once.
Then: "Rohan's father called me today."
At the office.
"He wanted to know if everything was okay at home."

* ["I'll do better next time."]
    ~ stress = stress + 10
    He repeats it back, flat. "Better."
    -> act2_slap

* ["The paper was hard. Everyone did badly."]
    ~ stress = stress + 20
    He looks at you the way you look at a sum that doesn't add up.
    -> act2_slap

* [Say nothing. Look at the floor.]
    ~ stress = stress + 15
    The floor has a crack in it you've never noticed before.
    You study it.
    -> act2_slap

* [PERMANENT: "I didn't understand the chapter. I was scared to ask."]
    -> act2_choice2

=== act2_slap ===
# character:rahul_child_fear
# background:living_room_night
"What do I tell people."
He doesn't say it like a question.
A pause that is one beat too long.
[BREAK]
-> act2_slap2

=== act2_slap2 ===
It's fast.
You don't see his hand.
You only feel the heat on your cheek
and then the room is very loud
and then very quiet
and Mummy is in the kitchen doorway
and she doesn't move
and you learn something in that second
that you will carry for eight years
without ever putting a name to it.
[BREAK]
-> act2_geometry_box

=== act2_geometry_box ===
# character:rahul_child_neutral
# background:bedroom_day
Three days later.
Papa comes home and puts something on your desk.
He doesn't say anything.
He doesn't meet your eye.
He goes to wash his hands.
It's a geometry box.
The good kind. German compass.
The one you pointed at in the shop three months ago
and he said not now.
You sit there for a long time.
You are eight years old
and you already understand
that this is the only language he has for sorry.
That it isn't quite sorry.
That you will take it anyway.
Because it is what there is.
[BREAK]
-> act3_screen1

=== act3_screen1 ===
# character:none
# background:fade_white
You are not {player_name} anymore.
[BREAK]
-> act3_screen2

=== act3_screen2 ===
# character:papa_tired
# background:living_room_night
You are Papa.
You are 44 years old.
You have been tired for eleven years.
You came home early today because your father called.
At the office.
He wanted to know how the boy was doing in school.
He said: "Our name means something in this town."
He said it the way he always says things.
Like a door closing.
[BREAK]
-> act3_depletion1

=== act3_depletion1 ===
# character:papa_tired
# background:office_corridor
Before you left the office —
your supervisor stopped you in the corridor.
The quarterly numbers are short.
He didn't say anything directly.
He didn't have to.
~ composure = composure - 20
~ energy = energy - 15
[BREAK]
-> act3_depletion2

=== act3_depletion2 ===
# character:papa_tired
# background:home_entrance_evening
Before you came home —
the landlord's message was on your phone.
Deposit increase. From next month.
You read it in the auto.
You didn't reply.
~ composure = composure - 15
~ stress = stress + 20
[BREAK]
-> act3_depletion3

=== act3_depletion3 ===
# character:papa_tired
# background:home_entrance_evening
Your wife says the school fee is due Thursday.
She says it quietly, knowing the timing.
You nod.
You don't know yet where it's coming from.
~ composure = composure - 15
~ stress = stress + 15
[BREAK]
-> act3_flip_choice

=== act3_flip_choice ===
# character:papa_controlled
# background:living_room_night
64.
You say the number.
Then you hear yourself say:
"Rohan's father called me today."
You hear it like it's coming from another room.
Like your mouth learned this from somewhere
and is running the script
while you watch from slightly behind your own eyes.

* ["Rohan's father called me. At the office."]
    ~ chose_kind_option = false
    The script runs.
    It does what it always does.
    It works.
    The pressure releases.
    Your son's face does the thing you remember your face doing.
    You recognise it and look away.
    -> act3_end

* ["I'm not angry. I'm disappointed."]
    ~ chose_kind_option = false
    Different words.
    The door closes the same way.
    -> act3_end

* [Set the paper down. Say nothing tonight.]
    ~ chose_kind_option = false
    You eat dinner.
    The number sits between you all evening
    like a third person at the table.
    -> act3_end

* [FAINT: "Tell me what happened with this chapter."]
    ~ chose_kind_option = true
    ~ can_call_home = true
    The words come out wrong.
    You don't have the shape for this conversation.
    Nobody ever had it with you.
    You sit there, both of you,
    in the clumsy silence
    of a thing being tried for the first time.
    It isn't a good conversation.
    But it's a different one.
    -> act3_end

=== act3_end ===
# character:none
# background:fade_grey
[BREAK]
-> act4_return

=== act4_return ===
# character:rahul_teen_neutral
# background:classroom_day
Your phone is face-down on the desk.
It has been there for twenty-three minutes.
[BREAK]
-> act4_choice

=== act4_choice ===
# character:rahul_teen_neutral
# background:classroom_day
What do you do?

* [Turn it over and look]
    You look at the number.
    You put the phone back down.
    -> act4_ending

* [Ask Rohan to check for you]
    Rohan checks.
    You nod.
    -> act4_ending

* [Put it in your bag. You'll look at home.]
    The bag goes on your shoulder.
    -> act4_ending

* [LOCKED: Call home. Tell them before you see it yourself.]
    -> act4_call_home

=== act4_call_home ===
# character:rahul_teen_neutral
# background:classroom_day
The phone rings twice.
Then your mother picks up.
You say the number before she asks.
There is a silence on the other end.
Then: "Okay. Come home."
Two words.
You don't know yet what to do with them.
[BREAK]
-> act4_ending

=== act4_ending ===
# character:none
# background:black
You are sixteen.
You were eight.
You will be both for the rest of your life.
-> END