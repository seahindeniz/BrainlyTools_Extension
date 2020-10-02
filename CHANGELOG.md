# Changelog

All notable changes to this project will be documented in this file.

## [7.7.0] - 2020.09.29

### Added

- A way to see user warnings from profile page without visiting warnings page
  [#257]
- A way to ask the user to select a field while entering usernames/profile
  links/ID's using the Mass moderate tool. [#262]

### Changed

- Unable to delete account from profile [#258]
- Reported content boxes are coloured light-blue when a task is confirmed, and
  when a ticket is closed (without confirming the content). [#261]

[#257]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/257
[#258]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/258
[#261]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/261
[#262]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/262

## [7.6.0] - 2020.09.29

### Added

- An option to copy shortened URL's by right-clicking a link. [#251]
- There's a bit of a lag while moderating contents at the very bottom of a page
  of reports. [#238]

### Changed

- Quick Delete Buttons don't appear when question links are visited by using the
  CTRL + left click shortcut, or when in the background. (sometimes) [#201]
- Mass Moderate Tool exhausting the Ticket Limit [#252]
- The option to use ">" to navigate to the next attachment in an answer/question
  should not be usable while viewing the last attachment. [#253]
- 'Visible reports' counter in the new mod panel doesn't update the number when
  a subject/category that contains 0 reports is chosen. [#256]

[#201]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/201
[#238]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/238
[#251]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/251
[#252]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/252
[#253]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/253
[#256]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/256

## [7.5.1] - 2020.09.29

### Changed

- A bug that's caused due to subjects that can be chosen directly from moderate
  all, and from the mass-moderate option. [#237]
- An error is displayed while the process is running correctly. [#243]
- Selective deletion tools aren't working for questions. [#244]
- Mass-moderate tools aren't working. [#245]
- Kullanıcı içeriğindeki kutucuklar tam algılamıyor. [#247]
- Pop-ups are displayed behind the "Question Moderation" tab in the reported
  contents page. [#248]
- Invalid page numbers display reported contents. [#249]
- A way to distinguish corrected answers from answers that haven't been
  corrected in the new mod panel. [Similar to the feature in the old panel]
  [#250]

[#237]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/237
[#243]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/243
[#244]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/244
[#245]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/245
[#247]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/247
[#248]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/248
[#249]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/249
[#250]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/250

## [7.5.0] - 2020.09.26

### Added

- Toggle Option in User content Selective deletion [#133]
- A way to copy links of multiple questions on the "View User Content" page.
  #[161]
- A 'Jump to Log' button beside questions. [#232]

### Changed

- Quick Delete Buttons don't appear when question links are visited by using the
  CTRL + left click shortcut, or when in the background. (sometimes) [#201]
- Rank kutucukları [#231]
- Extension Connection Error [#235]
- Quick delete buttons aren't appearing over questions. (When question links are
  visited) [#239]
- Don't give points back button is not working on the questions screen [#240]
- Quick delete buttons are visible on question with verified answer in the
  moderate panel [#241]

[#133]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/133
[#161]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/161
[#201]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/201
[#231]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/231
[#232]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/232
[#235]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/235
[#239]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/239
[#240]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/240
[#241]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/241

## [7.4.0] - 2020.09.20

### Added

- Ek bilgiler alanına göre şikayetleri filtreleme [#208]
- Ability to filter reports in the mass-moderate section by subjects. (Instead
  of choosing it from the reported contents page) [#217]
- Ability to filter reported contents by the number of attachments [#220]
- A button to clear the list of users on the mass-point changer tool [#224]
- Ability to see special ranks in the question page [#225]

### Changed

- Mass-Point changer doesn't work with only 1 id number [#222]
- Unable to spread pre-defined points into input boxes after pasting list of ids
  with points [#223]
- Restrict confirm button on reported answers [#226]

[#208]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/208
[#217]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/217
[#220]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/220
[#222]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/222
[#223]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/223
[#224]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/224
[#225]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/225
[#226]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/226

## [7.3.0] - 2020.09.13 - 2020.09.17

### Added

- Ability to use QDBs and selective deletion tool on short answers page [#135]
- Toplu Puan Değiştirici Çoklu Puan Belirleme [#155]
- Ability to filter reported content by content length [#163]
- A button to clear all comments in the moderate panel [#182]
- Urgency of a way to stop exclusion of 'verified questions' using quick buttons
  [#203]
- Şikayetler arası geçiş [#205]
- "Çoklu Puan Değiştirici" Kısmında Tab Tuşu Kullanıldığında Alt Satıra Geçme
  [#204]
- Use the new moderate panel on questions in homepage [#216]

### Changed

- Correction reports count is not updating [#202]
- Şikayet edilen içerikler sayfasında şikayetler arası geçiş sorunu [#207]
- Şikayetler arasında geçiş yaparken yükleniyor olarak kalıyor [#209]
- Page numbers are visible to comment and correction reports [#210]
- Delete reason section for comment doesn't show up [#211]
- Mass-Moderate delete action, show wrong message [#212]
- Unable to delete reported contents with Mass-Moderate contents tool on
  reported contents [#213]
- Mass-Point changer shows deleted users [#214]
- Unable to confirm reported comments [#215]
- QDB's and selective deletion isn't working on the search page [#219]

[#135]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/135
[#155]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/155
[#163]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/163
[#182]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/182
[#202]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/202
[#203]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/203
[#204]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/204
[#205]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/205
[#207]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/207
[#209]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/209
[#210]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/210
[#211]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/211
[#212]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/212
[#213]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/213
[#214]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/214
[#215]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/215
[#216]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/216
[#219]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/219

## [7.2.0] - 2020.09.06

### Added

- An option to un-approve approved answers in the mod panel. [#158]
- A way to directly close the ticket when viewing the log at the very bottom of
  a ticket. [#184]

### Changed

- (Possibly fixed, not enough samples to perform test) Hızlı silim butonlarında
  hata [#194]
- The 'Find users' & 'Notice Board' options do not appear when "M" is clicked
  when question links are visited. [#196]
- Quick delete buttons 1 and 3 are the same. [#197]
- Content details display outside the box [#199]
- Confirm button is visible on non-reported answers [#200]

[#158]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/158
[#184]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/184
[#194]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/194
[#196]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/196
[#197]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/197
[#199]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/199
[#200]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/200

## [7.1.1] - 2020.09.03

### Changed

- The text corresponding to the reasons for deletion is not displayed [#192]

[#192]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/192

## [7.1.0] - 2020.09.01

### Added

- (Partially) A way to directly close the ticket when viewing the log at the
  very bottom of a ticket. [#184]
- Hide next/prev buttons when there is one attachment [#191]

### Changed

- Incorrect reason for deletion [#173]
- Mass-Content deleter isn't working [#186]
- Unable to attach file while deleting accounts [#189]
- Attachments don't open in new tab [#190]

[#173]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/173
[#184]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/184
[#186]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/186
[#189]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/189
[#190]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/190
[#191]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/191

## [7.0.1] - 2020.08.31

### Changed

- Quick delete buttons [#164]
- Lack of translations [#172]
- Incorrect reason for deletion [#173]
- Page numbers are working incorrectly [#174]
- A black patch beside usernames in inbox. [#175]
- Quick delete buttons used to delete answers are displaying incorrect reasons.
  [#176]
- Page numbers rendering time is too much [#177]
- QDB's in 'Always fixed mode' in the new mod panel load only when the cursor is
  placed over the report. [#178]
- Unable to confirm a reported comment [#179]
- Quick delete buttons (that appear over reports) in the new mod panel do not
  perform the moderation when used. [#180]
- Quick delete reasons on buttons are not saved. [#181]
- Points need to be taken back by default when invalid answers are deleted.
  [#183]
- Unable to confirm reported content in the Reported contents page [#185]
- Mass-Content deleter isn't working [#186]
- Unable to see moderators in the Mass-Message sender [#187]
- Unable to send messages to moderators from the supervisors page [#188]

[#164]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/164
[#172]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/172
[#173]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/173
[#174]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/174
[#175]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/175
[#176]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/176
[#177]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/177
[#178]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/178
[#179]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/179
[#180]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/180
[#181]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/181
[#183]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/183
[#185]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/185
[#186]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/186
[#187]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/187
[#188]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/188

## [7.0.0] - 2020.08.29

### Added

- Introduce the beta version of the new Reported contents page - Moderate all
  replacement [M#4]

### Changed

- Extension will be written in Typescript now
- Quick delete buttons [#164]
- Disappearing Quick Delete Options on Home Page [#166]
- Kullanıcı içeriğinde sayfa çok kayıyor. [#167]
- User notes not saving [#168]

[M#4]: https://github.com/seahindeniz/BrainlyTools_Extension/milestone/4
[#164]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/164
[#166]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/166
[#167]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/167
[#168]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/168

## [6.38.0] - 2020.07.22

### Added

- New confirm and approve buttons (<https://prnt.sc/tlbmt2>)
- Kullanıcı içeriğinde sayfalar arası geçiş için olan butonlar yön tuşları ile
  de kullanılabilir. [#152]

### Changed

- Users contents page size has resized to be more size-friendly to different
  screen sizes and to avoid horizontal scrolling.
  - Desktop (<https://prnt.sc/tlbnad>) (<https://prnt.sc/tlboms>)
  - Mobile (<https://prnt.sc/tlbplt>) (<https://prnt.sc/tlbr7s>)
- CTRL + click action isn't working on question link [#153]

[#152]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/152
[#153]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/153

## [6.37.1] - 2020.07.18

### Changed

- 'Moderate' option doesn't appear under Questions while using Selective
  deletion tools. [#151]
- Moderate all page size has resized to be more size-friendly to different
  screen sizes and to avoid horizontal scrolling.
  - Desktop (<https://prnt.sc/tk3lmr>)
  - Mobile (<https://prnt.sc/tk3n5j>)

[#151]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/151

## [6.37.0] - 2020.07.16

### Added

- Kullanıcı içeriğinde sayfalar arası hızlı geçiş [#149]

### Changed

- Some issues with the Mass-Point changer
- Visual Change to Pages in Mod Panel [#139]
- Anasayfada ders konusu seçildiğinde eklenti seçenekleri çıkmıyor. [#144]
- Onayla butonu [#145]
- Missing Quick Delete Options on Question Pages for Answers [#146]
- Find Users, Notice Board & Mass Moderate Tools don't show up on the homepage
  under the Moderation Panel. [#147]
- Moderation tools under the "What Is your question?" tab doesn't show up.
  [#148]
- Bug while using Selective deletion tools after the "Ask for Correction" option
  is used. [#150]

[#139]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/139
[#144]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/144
[#145]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/145
[#146]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/146
[#147]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/147
[#148]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/148
[#149]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/149
[#150]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/150

## [6.36.8] - 2020.06.21

### Changed

- Ana sayfada soru yanındaki ikonlar gözükmüyor. [#136]

[#136]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/136

## [6.36.7] - 2020.06.15

### Changed

- Possible fix for Brainly's 403 error

## [6.36.6] - 2020.06.12

### Changed

- Question container gets smaller after quick delete buttons appear

## [6.36.5] - 2020.06.09

### Changed

- Possible fix for Mass-Moderate reported contents

## [6.36.4] - 2020.05.20

### Changed

- Possible fix for Brainly's 403 error

## [6.36.3] - 2020.05.17

### Changed

- Possible fix for Brainly's 403 error

## [6.36.2] - 2020.05.14

### Changed

- Can't change delete reason preferences (brainly.lat)

## [6.36.1] - 2020.05.13

### Changed

- Quick delete buttons not working on question page (brainly.com)

## [6.36.0] - 2020.05.11

### Added

- Ability to sort ranks [#127]

### Changed

- Quick delete buttons are not working on the corrected reports [#126]

[#126]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/126
[#127]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/127

## [6.35.8] - 2020.05.06

### Changed

- Reported comments deleter is not working [#122]
- Hesap Silme bölümündeki dosyalar kısmı tam çalışmıyor. [#123]
- Can open question link in mass moderate reported contents [#125]

[#122]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/122
[#123]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/123
[#125]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/125

## [6.35.7] - 2020.05.06

### Changed

- Toplu silim bölümündeki seçeneklerde hata. [#119]
- Ödev içeriğinde soru silinmiyor. [#120]
- Mass moderate reported contents cannot filter contents [#121]

[#119]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/119
[#120]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/120
[#121]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/121

## [6.35.6] - 2020.05.05

### Changed

- Some tools are not working

## [6.35.5] - 2020.05.05

### Changed

- Mass-Moderate contents isn't working
- Quick Action Button covering edit option elements in Indonesia Website [#116]
- Mass-point changer isn't parsing pasted details [#117]
- Selective deletion is not working on the search page [#118]

[#116]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/116
[#117]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/117
[#118]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/118

## [6.35.4] - 2020.04.27

### Changed

- Reconstruction of Mass-moderate reported contents
- Toplu silim bölümündeki düzenlede hata. [#112]
- Robot hatası. [#113]

[#112]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/112
[#113]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/113

## [6.35.3] - 2020.04.08

### Changed

- Cache issue on delete reason preferences
- "Drag and Drop" not working for Evidence "add files" box [#107]
- Breaking changes in brainly style-guide [#109]

[#107]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/107
[#109]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/109

## [6.35.2] - 2020.03.28

### Changed

- Delete options fixed

## [6.35.0] - 2020.03.28

### Added

- Arrow keys function for moderate all panel [#103]

### Changed

- Evidence and comment inputs for admins [#104]

[#103]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/103
[#104]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/104

## [6.34.0] - 2020.03.27

### Added

- Hide content delete options from profile [#99]
- Open more panel as default [#100]
- One click account deletion [#101]

### Changed

- Hızlı Silim Butonu [#94]

[#94]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/94
[#99]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/99
[#100]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/100
[#101]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/101

## [6.33.0] - 2020.02.25

### Added

- Unnecessary component cleaner for Freelancers (<https://ibb.co/JnMck6p>)
- Button for freelancers to return back specific page (<https://ibb.co/j5kCH0D>)

### Changed

- Moderate all [BETA]:
  - Change view button behavior (<https://ibb.co/p0GfLmK>)
  - Report box (<https://ibb.co/Zhb8ZSR>):
    - Toggle quick delete buttons
    - Relative time on detail section
  - Moderate panel (<https://ibb.co/jWzjS8J>):
    - Mustard colored quick delete buttons for question
    - Confirm only button for approvers
    - New navigation buttons
    - Better error handling. Workaround for [#90]

[#90]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/90

## [6.32.3] - 2020.02.12

### Changed

- [#88] Mass-Message sender is not working correctly
- [#89] Extension doesn't work on Android

[#88]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/88
[#89]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/89

## [6.32.2] - 2020.02.12

### Changed

- [#83] "Find user" option on moderation panel is not working correctly
- [#84] Notification message appears after searching user and refreshing the
  page
- [#85] Checkboxes always in loading state
- [#86] Different colors for different type of quick delete buttons
- [#87] Empty "More" label

[#83]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/83
[#84]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/84
[#85]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/85
[#86]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/86
[#87]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/87

## [6.32.1] - 2020.02.04

### Changed

- The "MORE.." section on the profile page will remain visible permanently
- Account deletion reporter is not working

## [6.32.0] - 2020.01.31

### Added

- Extension is now available on Brainly.ro

### Changed

- [#82] Remove selective content deletion on self profile

[#82]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/82

## [6.31.6] - 2020.01.16

### Changed

- Mass-Point changer option is visible to some users who has no have permission
  to use it.
- Rank names of manage special ranks are not rendering correctly on profile page

## [6.31.5] - 2020.01.16

### Changed

- "Extension user" label appears too many times in each opening the conversation
  page.

## [6.31.4] - 2020.01.15

### Changed

- "Extension user" label isn't visible on the messages page
- Finding deletion reports in extension options takes too long time

## [6.31.3] - 2019.12.28

### Changed

- Empty keywords list loader shows up after opening the answering editor at
  secondary time.

## [6.31.2] - 2019.11.30

### Changed

- Some contents cannot be deleted selectively on user contents page

## [6.31.1] - 2019.11.22

### Changed

- Mass-Content deleter is not working

## [6.31.0] - 2019.11.22

### Added

- Introduce keyword list for admins

### Changed

- Page crashing while adding huge amount of ids into id range
- Brainy blocking the extension due to adding answers to frequently. 

## [6.30.2] - 2019.11.13

### Changed

- Brainly.pl > Quick delete buttons doesn't work
- Can't add answers by providing list of question ids
- Can't add id range in mass-message sender
- Page freeze after pasting more than 1000 ids into list of ids

## [6.30.0] - 2019.11.01

### Added

- Reported content icons on users content page (<https://ibb.co/m9SRXhP>)

### Changed

- [#81] Users contents stuck on loading stage on users contents page
- Selective deletion is not working
- Quick delete buttons not working on the question page
- Extension is not working after fresh installation

[#81]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/64

## [6.29.0] - 2019.10.19

### Added

- New extension user badge and menu (<https://streamable.com/oh3le>)

### Changed

- Quick delete buttons is not visible
- Close icon is not visible

## [6.28.0] - 2019.07.26

### Added

- [#70] Problem: Cannot mass-report questions and answers on Brainly
- [#74] Mass-Moderate contents (<https://ibb.co/Tv2yqW5>)
 (<https://ibb.co/YNTQZNp>) (<https://ibb.co/ss555Dt>)
- [#76] Selective deletion across multiple pages in brainly-in/app/ask? missing
  in the extension.

### Changed

- Can't find users by using the rank filter in messages
- [#64] Question Search Bar

[#64]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/64
[#70]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/70
[#74]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/74
[#76]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/76

## [6.27.1] - 2019.07.29

### Changed

- [#52] Comments deleter stops
- Can't able to delete some questions with quick delete buttons
- (Brainly.com) Wrong reason message on abuse reports
- Position of extension's notification icon is misplaced

[#52]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/52

## [6.27.0] - 2019.07.24

### Added

- (Brainly.com) Quick delete buttons will report contents for abuse while
  deleting

## [6.26.0] - 2019.07.23

### Added

- [#63] Regarding mass point adder
- [#73] While deleting using quick buttons, show the Moderator the reason with
 which they are deleting

### Changed

- [SG#1584] Buttons are changed to avoid using deprecated elements and comply
 changes of Brainly
- Couldn't able to add personal notes in profile or messages page
- Selected user privileges are not shown on ext. options after updating
  privileges

[#63]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/63
[#73]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/73
[SG#1584]: https://github.com/brainly/style-guide/issues/1584

## [6.25.0] - 2019.07.02

### Added

- Ability to approve all answers of all listed users by their user ids accounts
 from Mass-Manage users panel

### Changed

- Red button color has been restored
- Load more button size is fixed on moderate all

## [6.24.0] - 2019.06.24

### Added

- Deleting multiple accounts from Mass-Manage users panel

### Changed

- Fixed layout rendering issue on Moderate all

## [6.23.1] - 2019.06.15

### Added

- [#59] Checkboxes in action checking page (<https://ibb.co/f2DjCyP>)
  (<https://ibb.co/q9dcVz0>)
- [#69] Kullanıcı içeriğinde toplu silim yetkisi olmadan ödev içeriği
  görüntüleme

### Changed

- [#65] mesaj ve toplu düzenleme
- [#67] TD içerisinde yapılan silimlerde uyarı verilmiyor
- [#68] Eklenti bazı adresleri engelliyor

[#59]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/59
[#65]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/65
[#67]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/67
[#68]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/68
[#69]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/69

## [6.22.5] - 2019.05.13

### Changed

- Mass-Reported contents confirmer changed into Mass-Moderate reported contents.
 In the new enhancement, extension will give you ability to confirm/delete
 reported questions/answers by filtering. (Restricted function)
- [#61] Error in quick buttons
- [#60] Group messages error

[#61]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/61
[#60]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/60

## [6.22.4] - 2019.05.04

### Changed

- [#58] Issue related to Extension of Brainly India Market [Not authorized to
 perform this operation]

[#58]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/58

## [6.22.3] - 2019.05.02

### Changed

- Some code lines has been changed and fixed

## [6.22.2] - 2019.04.22

### Changed

- Some informative text added into the Mass-Content deleter
  (<https://ibb.co/1zBJ6mh>)
- Reported contents confirmer has deprecated for enhancement

## [6.22.1] - 2019.04.21

### Changed

- Mass-Question deleter changed into Mass-Content deleter
  (<https://ibb.co/6t7Y6cT>)
- New styling for the pagination buttons of the Moderate all
  (<https://ibb.co/0rMYHJx>)
- [#53] Selective deletion on search page misbehaving

[#53]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/53

## [6.22.0] - 2019.04.14

### Added

- Selective deletion on question search (<https://ibb.co/ws9xgyt>)
- [#49] Quick delete buttons on question search (<https://ibb.co/ws9xgyt>)

[#49]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/49

## [6.21.2] - 2019.04.05

### Changed

- [FIX#45] Problems in mass comment deleter
- [FIX#46] Colour Difference Issue
- [FIX#47] arkadaş listesi hk.

[FIX#45]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/45
[FIX#46]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/46
[FIX#47]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/47

## [6.21.1] - 2019.04.03

### Changed

- [FIX#44] "Assign Extension Privileges" Option Visibility

[FIX#44]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/44

## [6.21.0] - 2019.04.03

### Added

- Extension is available on Brainly.ph

## [6.20.0] - 2019.03.30

### Added

- Mass-Message sender reinstated [SS-1], [SS-2], [SS-3]
- Quick preview of user privileges (restricted) [SS-4]
- Quick assign extension permission button (restricted) [SS-5]
- Mass-Point changer: Sequential navigation on the points inputs by pressing the
 tab key
- [#42] Mass point changer changes

### Changed

- [FIX#41] Mass-Point changer "User not found" issue

[SS-1]: https://ibb.co/S71qcxQ
[SS-2]: https://ibb.co/3vbBp8r
[SS-3]: https://ibb.co/NT5Dy4G
[SS-4]: https://ibb.co/Xb1BLBN
[SS-5]: https://ibb.co/w0KVNMT
[#42]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/42
[FIX#41]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/41

## [6.19.2] - 2019.03.24

### Changed

- Brainly.com > Default delete reasons

## [6.19.1] - 2019.03.22

### Changed

- [FIX] Styling and other issues related to v6.19.0

## [6.19.0] - 2019.03.22

### Added

- [#28] Notice board (<https://ibb.co/6DKVh5s>)
- Moderation panel height fixer. Normally, the height size of the Brainly's
 moderation panel is not good for both desktop and mobile devices

### Changed

- Moderate all pagination is working again
- Profile info box updated (<https://ibb.co/hcb0fHf>)
- Personal note box updated (<https://ibb.co/BKQ7bm4>)
- [#5] Mass Point changer and Question deleter

[#28]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/28
[#5]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/5

## [6.18.0] - 2019.03.12

### Added

- [#34] Selective ask for correction (<https://ibb.co/7bSjPX4>)

### Changed

- Account delete reporter has an issue while trying to delete an account
- Extension permissions downgraded
- [FIX#35] Delete reasons are not updated
- [FIX#36] Attachment symbol errors

[#34]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/34
[FIX#35]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/35
[FIX#36]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/36

## [6.17.1] - 2019.03.09

### Changed

- [FIX#32] Confirm button isn't working
- [FIX#33] Selective Deletion of answers doesn't work

[FIX#32]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/32
[FIX#33]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/33

## [6.17.0] - 2019.03.09

### Added

- Extension is available for Brainly.com.br and Brainly.lat communities

### Changed

- Users content page enhanced. Question preview and attachment sections and
 status icons are updated. (<https://ibb.co/znTJmMF>)
- [FIX#23] Selective approval gives Selective deletion too
- [FIX#24] Not able to see *Message option* in supervision page
- [FIX#25] Quick Buttons modification in panel
- [PRE-FIX#29] Mass point changer editing
- [FIX#30] 3rd quick delete button
- [FIX#31] İçerik silimi sırasında uyarı verilmiyor

[FIX#23]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/23
[FIX#24]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/24
[FIX#25]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/25
[PRE-FIX#29]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/29
[FIX#30]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/30
[FIX#31]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/31

## [6.16.0] - 2019.02.14

### Added

- [#12] Reported contents confirmer. This feature is for confirming the reported
 contents from the Moderate all by filtering and it helps those who has been a
 victim of spam reporting. (<https://ibb.co/GV98fqr> <https://ibb.co/zWdJfCx>)

### Changed

- [FIX#21] Unexpected Error claiming, "You are not authorized for this"

[#12]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/12
[FIX#21]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/21

## [6.15.0] - 2019.02.10

### Added

- [#2] Reported comments deleter

### Changed

- [FIX#4] Mass Point Changer (Partially)
- [FIX#7] Mass-Question deleter issue
- [FIX#6] Group message sender, can't able to create group
- [FIX#15] Bio Section of Brainly's Profile Not visible
- [FIX#19] More Options tools not opening

[#2]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/2
[FIX#4]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/4
[FIX#7]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/7
[FIX#6]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/6
[FIX#15]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/15
[FIX#19]: https://github.com/seahindeniz/BrainlyTools_Extension/issues/19

## [6.14.1] - 2019.02.03

### Changed

- Stucking while deleting comments on user content page

## [6.14.0] - 2019.02.03

### Added

- Multiple file uploader(For admins of Brainly) (<https://ibb.co/C8r07rs>)
- Mass-Point changer (<https://ibb.co/sWPjMv8>)
- Bulk user privilege changer(For extension managers) (<https://ibb.co/x3CNWLQ>)

### Changed

- Quick delete buttons ans selective content deletion privileges has been
 separated.
 (Concerns only extension managers) (<https://ibb.co/vDMDhbX>)
- Chatango service isn't useful anymore, so I removed :)
- Stucking while deleting comments on user content page

## [6.13.0] - 2019.01.29

### Added

- Rank changer. Additional rank changer is for deleting rank by selecting it.
 This is handy when you want to remove specific rank from a user without
 deleting all other ranks. (<https://ibb.co/mzg3ZdW>)

### Changed

- Issue while deleting comments and stucking because of it has already a ticket
 that opened by other moderator for that content. You will now be notified by
 this problem (<https://ibb.co/bLzFnyp>)

## [6.12.0] - 2019.01.25

### Added

- User profile link added into reported content box in moderate all
 (<https://ibb.co/ns6mscv>)

### Changed

- User content quick deleting stucking solved
- Ticket issue solved (Still in testing stage)

## [6.11.1] - 2019.01.22

### Changed

- Quick delete buttons didn't a give warning while deleting content from
 moderate all

## [6.11.0] - 2019.01.21

### Added

- Brainly.com market initialized
- Quick confirm button for reported questions and answers in Moderate All

### Changed

- Moderate all pagination
- Can't able to confirm reported comments
- Dependency updated

## [6.9.0] - 2019.01.17

### Added

- Brainly.in market initialized

## [6.8.2] - 2019.01.12

### Changed

- Some issues fixed

## [6.8.0] - 2019.01.06

### Added

- You can see the list of shortened links that you've created before
 (<https://ibb.co/YZ3g242>)

### Changed

- Theme color styling has changed to animated background color to get more
 beautiful display
- [FIX] Moderate all pagination has issue with adding page numbers
- [FIX] Can't able to add personal note

## [6.7.1] - 2018.12.29

### Added

- You can now press ESC key on your keyboard to exit cancel ticket and closing
 the moderation panel in the Moderate All

### Changed

- Can't able to filter or send message to moderators under the Supervisor's page
- Welcoming message has been removed from the homepage
 (<https://ibb.co/1mkgk8z>) This change removes the "ASK YOUR QUESTION" buttons
 as well. If you want to ask question on the homepage, you can still use the
 "ASK YOUR QUESTION" button below the "Brainliest users" section
 (<https://ibb.co/5YNyvNx>)

## [6.7.0] - 2018.12.28

### Added

- Moderator's can able to add evidences regarding to the account delete process
 when they needs to delete an account. (<https://ibb.co/JWY35V1>)

### Changed

- Performance improvements

## [6.6.1] - 2018.12.02

### Changed

- Group message sending

## [6.6.0] - 2018.12.01

### Changed

- Theme color changing process is now faster
- Structer optimized
- Server optimized

## [6.5.2] - 2018.11.17

### Added

- Deleting **comments** from user contents page is now possible
 (<https://ibb.co/bZXULL>)
- In the moderate all, you can now review reported contents by clicking left or
 right arrows on each side of panel or by pressing the A or D keys on your
 keyboard without closing and reopening the reported contents
 (<https://ibb.co/bvKAZf>)
- Ability to remove approvement from answers by selecting
 (<https://ibb.co/e7dQuf>)
- In moderate all, you can confirm reported comments by clicking the
 green button (<https://ibb.co/bJfjN0>)
- Push notifications. You can now able to get browser notifications for a
 new message or new notification once you've enabled it.
 (<https://ibb.co/dCiOLL>)

### Changed

- Stucking while deleting contents from user contents page

## [6.4.1] - 2018.11.09

### Changed

- Bio text container size fixed

### Removed

- Mass-messsage sender, sending message to all users of related market.
 It causes making too much send request to Brainly

## [6.4.0] - 2018.11.07

### Added

- Extension logo has changed (<https://ibb.co/iYWRA0>)
- Extension managers will now be able to assing "give warning" option to
 deletion reasons by default. With this way, if the moderator deletes a
 content by using the reason that has "give warning" flag, it will automatically
 gives a warning to content owner according to the definitions or showses and
 requires a additional confirmation from moderator before giving a warning in
 each delete. (<https://ibb.co/iYA3Q0> <https://ibb.co/gqXBCf>)
- Extension users will be able to change their own bio message from their
 profile page instead of using the mobile Brainly app (<https://ibb.co/cbrEhf>)

### Changed

- Brainly Tools logo will be attached to notifications that generated by the
 Brainly Tools to avoid confusing at between extension and
 Brainly notifications (<https://ibb.co/dAnuxf>)
- Stucking at mass-message sender while sending because of deleted accounts

## [6.3.0] - 2018.11.01

### Added

- Moderation panel pagination ability. Moderators can navigate between old and
 new reported contents by clicking the page numbers (<https://ibb.co/eNt6Nf>)

## [6.2.2] - 2018.10.30

### Changed

- Language issue on ID market

## [6.2.1] - 2018.10.30

### Changed

- Searching users while creating or editing a message group has a bug

## [6.2.0] - 2018.10.30

### Added

- This change log file :).
 We will see the new update logs here when there is a new update.

- Group messages: user can send a message to multiple users by grouping them at
 once.
- Mass-Question deleter, also restricted privilege.
 User can use for this to delete multiple questions by their ids in a list at
  once.
- Mass-Message sender, can send your message to the users by counting backwards
 from the given id number. It's currently in beta stage and needs some
  performance improvements. (<https://ibb.co/mb7tOA>)
- Under the "supervisors" page, you will some changes on the couple of elements
 (<https://ibb.co/htzafq>). Like filtering the users by selecting a rank or
  ranks in the ranks list. And also you can send a message to all moderators or
 listed moderators on this page.
 <https://brainly.co.id/moderators/supervisors/1> (You need to change the
 link for your market's domain name)

- Some of the language files are not translated by me so from now on these
 contributors nicks will be visible along with language names in the
 language options (<https://ibb.co/mKO5Vq>)

### Changed

- Finding a user by id on the moderation panel is now able to search using with
 nick and id (<https://ibb.co/f3i7BV>)
- Under the "User content view > responses" page, extension changes the
 layout for quick review. But shows you an attachment icon for who has added a
 attachment in to their response. This feature makes some confusion about who
 added this attachment, so in this update you can see only the related user
 answer attachment icon only. There is no need to show an icon for other user's
 attachments.
- Non-privileged extension users can't able to click
 [this](http://i.imgur.com/fRwLKqr.png) text before to switch the reported
 content between question&answer and comments, now its clickable. (Btw.
 moderator or non-moderator user's who has not any special privilege in the
 extension can also use the extension with just access permission can be given
 by the extension manager. This will not be any security risks for Brainly and
 moderating system at all, because they don't have privilege to make actions.)
- Under the "User content view" page, if listed contents are already deleted or
 approved by another user while extension user starts to delete or approve the
 content, extension will inform you about this and pass this process without
 being stucked.
- Under the "Archive Mod" page, the question delete buttons color is now orange
 #FBC02D (<https://ibb.co/eMLCAq>)
- The quick delete buttons labels are now visible on the mobile view when the
 user tries to touch it
- There is an issue with the extend message page layout checkbox in the
 extension options that the checkbox didn't show the current status.
- The unfriend all and unfriend buttons are has been hidden from the
 other users profile <https://ibb.co/fiNyrV>
