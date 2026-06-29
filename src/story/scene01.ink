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
# sound:Classroom
The results are out.
[BREAK]
-> act1_screen2

=== act1_screen2 ===
# character:rahul_teen_neutral
# image:Act1
# sound:Classroom
The classroom suddenly feels louder.
Your phone is face-down on the desk.
You put it there twenty minutes ago and haven't touched it since.
Everyone around you already knows.
[BREAK]
-> act1_choice

=== act1_choice ===
# character:rahul_teen_tense
# image:Act2
# sound:Classroom
Rohan got 91. He told you without being asked.
What do you do?

* [LOCKED: Call home. Tell them before you see it yourself.]
    -> act1_choice

* [Turn it over and look]
    -> act1_choice_option1

* [Ask Rohan to check for you]
    -> act1_choice_option2

* [Put it in your bag. You'll look at home.]
    -> act1_choice_option3



=== act1_choice_option1 ===
# character:rahul_teen_tense
# image:Option1
# sound:Classroom
57 out of 100.
You read it three times.
[BREAK]
-> act1_reflection

=== act1_choice_option2 ===
# character:rahul_teen_tense
# image:Option2
Rohan reads it for you.
57 out of 100.
He says the number with a kind face.
That somehow makes it worse.
[BREAK]
-> act1_reflection

=== act1_choice_option3 ===
# character:rahul_teen_tense
# image:Option3
It will still be the same number at home.
You know this.
You put the phone in your bag anyway.
[BREAK]
-> act1_reflection

=== act1_reflection ===
# character:rahul_teen_tense
# image:Act3
# sound:Classroom
You put the phone back in your bag.
Your hand stays there for a moment longer than it needs to.
The classroom is loud around you.
Nobody knows yet.
Soon everyone will.
[BREAK]
-> act1_reflection2

=== act1_reflection2 ===
# character:rahul_teen_tense
# image:Act3
# sound:Classroom
# wish:true
I wish I could call home.
[BREAK]
-> act1_end

=== act1_end ===
# character:none
# background:black
# transition:eight_years_earlier
[BREAK]
-> act2_screen1

=== act2_screen1 ===
# character:rahul_child_neutral
# image:Act4
# sound:Kitchen
You are sitting outside the kitchen,
and you are waiting,
and through the door you can hear the phone being put down.
Papa is home early.
He is never home early.
[BREAK]
-> act2_screen2

=== act2_screen2 ===
# character:rahul_child_neutral
# image:Act4
# sound:Kitchen
Your class test came back today.
64 out of 100.
You don't know this number will haunt the house for weeks.
You only know it's in your bag, and Papa is home.
[BREAK]
-> act2_choice1

=== act2_choice1 ===
# character:rahul_child_tense
# image:Act5
# sound:Room
Mummy comes out of the kitchen.
She sees your face.
She already knows something happened at school —
teachers have a way of calling before the children get home.
[BREAK]
-> act2_choice22

=== act2_choice22 ===
# image:Act5
# sound:Room
She doesn't say anything yet.
She just looks at you.

* [Tell her before Papa sees]
    ~ stress = stress + 10
    -> act2_papa_calls

* [Ask her what Papa already knows]
    ~ stress = stress + 15
    -> act2_papa_calls

* [Say nothing. Wait.]
    ~ stress = stress + 20
    -> act2_papa_calls

* [PERMANENT: Ask her to sit with you when you tell him.]
    -> act2_choice22

=== act2_papa_calls ===
# character:rahul_child_tense
# image:Act6
# sound:Beta
Papa's voice comes from the other room.
"Beta. Come here"
"You've learned to read the way he says things."
Tonight it means: I already know. Come here.
[BREAK]
-> act2_living_room

=== act2_living_room ===
# character:rahul_child_fear
# image:Act7
# sound:Room
The living room feels smaller at night.
Papa is in his chair, still in his office clothes.
That means he came straight to this.
The test paper is on the arm of the chair.
You don't know how it got there. Your bag was in the other room.
[BREAK]
-> act2_living_room2

=== act2_living_room2 ===
# image:Act7
# sound:Room
He doesn't look angry.
That's the thing nobody tells you —
it's worse when they don't look angry.
He just looks tired.
And like you made him that way.
[BREAK]
-> act2_choice2

=== act2_choice2 ===
# image:Act8
# character:rahul_child_fear
# background:living_room_night
# sound:Room
He picks up the paper.
He holds it the way you'd hold something you found in the drain.
64. He says the number once.
Then: "Rohan's father called me today."
"He wanted to know if everything was okay at home."
[BREAK]
-> act2_choice23

=== act2_choice23 ===
# image:Act9
# sound:Room
What do i tell him?

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
    -> act2_choice23

=== act2_slap ===
# character:rahul_child_fear
# image:Act9
# sound:Room
"What do I tell people."
He doesn't say it like a question.
A pause that is one beat too long.
[BREAK]
-> act2_slap2

=== act2_slap2 ===
# image:Act10
# sound:Slap
It's fast. 
You don't see his hand.
You only feel the heat on your cheek
and then the room is very loud and then very quiet
and you learn something in that second
that you will carry for eight years without ever putting a name to it.
[BREAK]
-> act2_time_skip

=== act2_time_skip ===
# character:none
# background:black
# transition:three_days_later
[BREAK]
-> act2_geometry_box

=== act2_geometry_box ===
# character:rahul_child_neutral
# image:Act11
# sound:Room
Papa comes home and puts something on your desk.
He doesn't say anything. He doesn't meet your eye.
He goes to wash his hands.
It's a geometry box.
The good kind. German compass.
[BREAK]
-> act2_geometry_box2

=== act2_geometry_box2 ===
# image:Act11
# sound:Room
You sit there for a long time.
And you understand
that this is the only language he has for sorry.
That it isn't quite sorry. That you will take it anyway.
Because it is what there is.
[BREAK]
-> act2_to_act3

=== act2_to_act3 ===
# character:none
# background:black
# transition:hold_onto_that
[BREAK]
-> act3_identity

=== act3_identity ===
# character:none
# background:black
You are not eight anymore.
You grew up.
You became something.
You are not sure it was what you meant to become.
[BREAK]
-> act3_screen1

=== act3_screen1 ===
# character:none
# background:fade_white
The memory doesn't change.
The person remembering it does.
[BREAK]
-> act3_screen2

=== act3_screen2 ===
# character:papa_tired
# image:Act200
# sound:Room

You are Papa.
You are 44 years old.
You have been tired for eleven years.
You came home early today because your father called.
At the office.
[BREAK]
-> act3_screen3

=== act3_screen3 ===
# image:Act200
# sound:Room
He wanted to know how the boy was doing in school.
He said, "Our name means something in this town."
He said it the way he always says things.
Like a door closing.

[BREAK]
-> act3_depletion1

=== act3_depletion1 ===
# image:Act201
# character:papa_tired
# background:office_corridor
# sound:Office

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
# image:Act202
# character:papa_tired
# background:home_entrance_evening
# sound:Traffic

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
# image:Act203
# character:papa_tired
# background:home_entrance_evening
# sound:Room

Your wife says the school fee is due Thursday.
She says it quietly, knowing the timing.
You nod.
You don't know yet where it's coming from.
~ composure = composure - 15
~ stress = stress + 15
[BREAK]
-> act3_flip_choice

=== act3_flip_choice ===
# image:Act204
# character:papa_tired
# background:living_room_night
# sound:silence
64. You say the number.
Then you hear yourself say:
"Rohan's father called me today."
You hear it like it's coming from another room.
Like your mouth learned this from somewhere
and is running the script.
[BREAK]
-> act3_flip_choice1

=== act3_flip_choice1 ===
# image:Act204
# character:papa_controlled
What do you say to the boy?

* ["Rohan's father called me. At the office."]
    ~ chose_kind_option = false
    The script runs.
    It does what it always does.
    It works.
    The pressure releases.
    Your son's face does the thing you remember your face doing.
    You recognise it and look away.
    [BREAK]
    -> act3_end

* ["I'm not angry. I'm disappointed."]
    ~ chose_kind_option = false
    Different words.
    The door closes the same way.
    [BREAK]
    -> act3_end

* [Set the paper down. Say nothing tonight.]
    ~ chose_kind_option = false
    You eat dinner.
    The number sits between you all evening
    like a third person at the table.
    [BREAK]
    -> act3_end

* [FAINT: "Tell me what happened with this chapter."]
    ~ chose_kind_option = true
    ~ can_call_home = true
    -> act3_kind_result

=== act3_kind_result ===
# image:Act204
# character:papa_tired
# sound:Room
The words come out wrong.
You don't have the shape for this conversation.
Nobody ever had it with you.
You sit there, both of you,
in the clumsy silence
of a thing being tried for the first time.
It isn't a good conversation.
But it's a different one.
[BREAK]
-> act3_end

=== act3_end ===
# character:none
# sound:Room
# transition:present_day
[BREAK]
-> act4_return

=== act4_return ===
# character:rahul_teen_neutral
# image:Act1
# sound:Classroom
Results are out!
Your phone is face-down on the desk.
It has been there for twenty minutes.
[BREAK]
-> act4_choice

=== act4_choice ===
# character:rahul_teen_neutral
# image:Act1
What do you do?

* [LOCKED: Call home. Tell them before you see it yourself.]
    -> act4_call_home

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

=== act4_call_home ===
# character:rahul_teen_neutral
# image:Act205
# sound:Classroom

The phone rings twice.
Then your mother picks up.
You say the number before she asks.
There is a silence on the other end.
Then: "Okay. Come home."
Her voice is calmer than you expected.
[BREAK]
-> act4_ending

=== act4_ending ===
# character:none
# background:black
You are sixteen.
You were eight.
You will be both for the rest of your life.
-> END