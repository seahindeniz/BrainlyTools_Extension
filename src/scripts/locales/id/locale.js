System.data.locale = {
	lang: "id",
	config: {
		account_using_for_approve: "",
		reserve: "Tiket",
		Deleted_account: "Akun yang dihapus",
		special_ranks_starts: 8,
		chatango: {
			for: "brainly.co.id",
			id: "cid0020000160003917943",
			handle: "brainlycoid"
		},
		change_forum_link: {
			use_it: false,
			links: [{
				title: "",
				link: ""
			}]
		},
		quickDeleteButtonsDefaultReasons: { //Recommended 2 items at least 
			task: ["Default", "Mapel Keliru"],
			response: ["Default", "Salinan Web Lain", "Tidak Relevan"],
			comment: ["Default", "Konten Pribadi", "Jawaban di Komentar"]
		}
	},
	texts: {
		globals: {
			nick: "Nick",
			rank: "Rank",
			moderator: "Moderator",
			username: "Username",
			ok: "Okay",
			save: "Save",
			cancel: "Cancel",
			choose_option: "Choose an option",
			select_all: "Select All",
			edit: "Edit",
			pause: "Pause",
			continue: "Continue",
			all_ranks: "All Ranks",
			warning__wait_for_process_done: "Tunggu sampai proses selesai, dan jangan menutup halaman",
			enterId: "Profile Id",
			saving: "Simpan",
			all: "Semua",
			all2: "All",
			accept: "Diterima",
			later: "Kemudian",
			show: "Show",
			extension_user: "Extension user",
			manage_users: "Mengelola extension user",
			previous_nicks: "Previous nicks:",
			previous_nicks_description: "User's previous nicks stored at extension",
			changes_affected: "Changes affected",
			errors: {
				operation_error: "Terjadi kesalahan selama proses operasi. Silahkan mencoba kembali",
				went_wrong: "Oops, terjadi kesalahan",
				options_cant_be_same: "Pilihan tidak boleh sama!",
				permission_error: {
					title: "Warning!",
					description: "Kamu pengguna plugin yang bukan wewenang kamu. Tolong hapus plugin nya."
				},
				only_number: "Hanya angka.",
				greater_than_zero: "Masukkan sebuah nomor diatas nol.",
				error_at_reason: "Operasi tidak lengkap.",
				update_account_error: "An expected error occurred while trying to update. Please try again in 2 sec.",
				if_error_continue: "If this error persists, please contact with extension manager and explain what happened :)"
			}
		},
		extension_options: {
			title: "Opsi Ekstensi",
			version_text: "Extension version: ",
			themeColor: {
				title: "Warna Tema",
				description: "Kamu dapat menggunakannya untuk mengubah warna dari tema Brainly.",
				choose_color: "Pilih sebuag warna",
				timer_color: "Breathing theme color",
				on_refresh_random: "Refresh untuk random warna",
				fontColorExample: "Warna dapat diatur dalam format hex. Jadi misalnya, Anda perlu menentukan warna merah sebagai #FF0000",
				rainbow: "Pelangi"
			},
			quick_delete_buttons: {
				title: "Tombol Cepat",
				description: "Untuk mengatur tindakan tombol hapus cepat",
				task: "Pertanyaan",
				response: "Jawaban",
				comment: "Komentar",
				button_1: "Slot 1",
				button_2: "Slot 2",
				button_3: "Slot 3",
				effects_on_refresh: "Tombol akan berubah ketika halaman di refresh"
			},
			otherOptions: {
				title: "Pilihan lain"
			},
			extendMessagesLayout: {
				title: "Memperluas pesan",
				description: "Opsi ini akan memperpanjang tata letak halaman pesan.\nAnda dapat mencobanya ketika halaman pesan aktif"
			},
			answer_box_height: {
				title: "Tinggi kotak jawaban",
				description: "Meningkatkan ukuran dari kotak balasan.\n Kamu dapat melihat lebih banyak konten pada nomor ini."
			},
			manage_users: {
				title: "Manage extension user's",
				description: "Managing extension user's access and privileges"
			},
			announcements: {
				title: "Extension announcements",
				description: "Managing extension interval announcements",
				short_description_of_announcement: "Title(inside of notification balloon)",
				publish: "Publish",
				draft: "Draft",
				on: "On",
				off: "Off"
			},
			hide_unnecessary_contents: {
				title: "Hide unnecessary containers",
				description: "This will hide unnecessary containers that we are not use all the time"
			}
		},
		management: {
			brainly_id: "Brainly Id",
			privileges: "Privileges",
			extension_privileges: "Extension privileges",
			first_usage_date: "First time of using the extension",
			access: "Extension access",
			can_use_extension: "Allow",
			can_not_use_extension: "Deny",
			comment: "Comment",
			js_grid: {
				grid: {
					noDataContent: "Not found",
					deleteConfirm: "Are you sure?",
					pagerFormat: "Pages: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount}",
					pagePrevText: "Prev",
					pageNextText: "Next",
					pageFirstText: "First",
					pageLastText: "Last",
					loadMessage: "Please, wait...",
					invalidMessage: "Invalid data entered!"
				},
				loadIndicator: {
					message: "Loading..."
				},
				fields: {
					control: {
						searchModeButtonTooltip: "Switch to searching",
						insertModeButtonTooltip: "Switch to inserting",
						editButtonTooltip: "Edit",
						deleteButtonTooltip: "Delete",
						searchButtonTooltip: "Search",
						clearFilterButtonTooltip: "Clear filter",
						insertButtonTooltip: "Insert",
						updateButtonTooltip: "Update",
						cancelEditButtonTooltip: "Cancel edit"
					}
				},
				validators: {
					required: {
						message: "Field is required"
					},
					rangeLength: {
						message: "Field value length is out of the defined range"
					},
					minLength: {
						message: "Field value is too short"
					},
					maxLength: {
						message: "Field value is too long"
					},
					pattern: {
						message: "Field value is not matching the defined pattern"
					},
					range: {
						message: "Field value is out of the defined range"
					},
					min: {
						message: "Field value is too small"
					},
					max: {
						message: "Field value is too large"
					}
				}
			},
			privileges_list: {
				20: {
					title: "Global > Extension admin",
					description: "Extension admin privilige"
				},
				23: {
					title: "Global > Extension announcements[Not prepared yet]",
					description: "Can manage extension internal announcements"
				},
				22: {
					title: "Mod Panel > <b>Cannot</b> delete multiple account",
					description: "Cannot delete multiple accounts in moderator panel even if user has account delete privilige"
				},
				24: {
					title: "Mod Func > <b>Cannot</b> delete multiple account",
					description: "Cannot delete multiple accounts in moderator functions even if user has account delete privilige"
				},
				1: {
					title: "Home Page > Express",
					description: "Can use express buttons in home page"
				},
				25: {
					title: "Question search > Express",
					description: "Can use express buttons in question search page"
				},
				2: {
					title: "M. All > Question express",
					description: "Can use the question express buttons in moderate all"
				},
				3: {
					title: "M. All > Answer express",
					description: "Can use the answer express buttons in moderate all"
				},
				4: {
					title: "M. All > Comment express (with selection)",
					description: "Can use the comment express buttons in moderate all"
				},
				5: {
					title: "M. All > Comment express (with buttons)",
					description: "Can use the comment express buttons in moderate all"
				},
				6: {
					title: "MKP > Question express",
					description: "Can use the question express buttons in Melihat konten pengguna"
				},
				7: {
					title: "MKP > Answer express",
					description: "Can use the answer express button in Melihat konten pengguna"
				},
				8: {
					title: "MKP > Answer approve",
					description: "Can use the answer approve button in Melihat konten pengguna"
				},
				19: {
					title: "MKP > Unapprove answers",
					description: "Can use the answer unapprove button in Melihat konten pengguna"
				},
				21: {
					title: "MKP > Mass. ask for correction",
					description: "Can use the massive ask for correction button in Melihat konten pengguna"
				},
				9: {
					title: "Question > Question express",
					description: "Can use the question express buttons in question page"
				},
				10: {
					title: "Question > Own answer approve",
					description: "Can use the own answer approve button"
				},
				11: {
					title: "Question > Answer express",
					description: "Can use the answer express buttons in question page"
				},
				12: {
					title: "Messages > Group message",
					description: "Can use group message sending"
				},
				13: {
					title: "Messages > Highlight vulgarisms (Not being used on Brainly US)",
					description: ""
				},
				15: {
					title: "Profile > Delete all comments",
					description: "Can delete all comments in other user's profile page"
				},
				16: {
					title: "Profile > Selectable comment delete",
					description: "Can delete selected comments in other user's profile page"
				},
				17: {
					title: "Profile > Mass. approve user's answers",
					description: "Can use the massive approve user's all answers function in profile page"
				},
				18: {
					title: "Profile > Star and thank user's answers",
					description: "Can use the thank and add star user's all answers function in profile page"
				}
			}
		},
		announcements: {
			title: "Pengumuman",
			announcement: "Pengumuman",
			description: "Tandai sebagai telah dibaca setelah kamu membaca pengumuman.",
			mark_as_read: {
				long: "Tandai telah dibaca",
				short: "Dibaca"
			}
		},
		moderate: {
			description: "Edit pada panel moderasi",
			take_points: {
				title: "Mengambil poin kembali poin responden",
				answer_title: "Mengambil poin kembali",
				description: "Menghapus poin yang diterima oleh responden, ketika mereka menjawab pertanyaan",
				answer_description: "Mengambil kembali poin dari user"
			},
			return_points: {
				title: " Mengmbalikan poin penanya",
				description: "Mengembalikan point penanya"
			},
			give_warning: {
				title: " Berikan peringatan",
				description: "Menghapus konten yang dipilih dengan peringatan"
			},
			moreOptions: "Lebih Banyak Opsi",
			confirm: "Konfirmasi",
			choose_reason: "Tolong pilih alasan penghapusan",
			question_removed: "Pertanyaan telah dihapus",
			do_you_want_to_delete: "Apakah kamu ingin menghapus konten ini?",
			authorized_content: "Authorized content. Apakah kamu yakin ingin menghapusnya?",
			authorized_comment: "Authorized content. Apakah kamu yakin ingin menghapusnya?",
			done_moderating: "Moderasi selesai",
			answer_deleted: "Jawaban telah dihapus",
			answers_deleted: "Jawaban telah dihapus"
		},
		moderate_all: {
			pages: "Pages",
			comments: {
				remove: "Menghapus komentar",
				confirm: "Konfirmasi Komentar"
			}
		},
		answer_approve: {
			approve: "Menyetujui",
			message__wait_for_approve: "Menyetujui jawaban anda sendiri mungkin membutuhkan waktu yang lebih lama dari biasanya. Tolong menunggu...",
			approved: "Approved",
			message__approved: "Jawaban telah disetujui. Verificasi selesai dilakukan dengan akun sendiri."
		},
		notes: {
			placeholder: "Add a note...",
			description: "Kamu dapat menambahkan catatan terkait pengguna disini",
			personal_note: "Menambahkan catatan personal..."
		},
		todays_actions: "Aksi hari ini",
		messages: "Pesan",
		groups: {
			title: "Grup",
			choose_group: "Pilih sebuah grup",
			add_group: "Add grup",
			edit_group: "Edit grup",
			group_added: "Tambah Grup",
			dbl_click_for_edit_title: "Double-click untuk mengubah judul",
			save_changes: "Simpan perubahan",
			changes_saved: "Perubahan disimpan",
			delete_group: "Menghapus grup",
			do_you_want_to_delete_group: "Kamu ingin mengahapus grup ini?",
			group_deleted: "Grup telah dihapus",
			search_except_friends: "Untuk menambahkan anggota grup, Ketik username dan klik pada ${search_icon} icon. Cari nama mereka dibawah ini dan masukkan kartu nama user kedalam panel sebelah kanan.",
			enter_username: "Maukkan sername atau nomor ID",
			dont_forget_save: "Untuk menghapus seorang anggota grup, masukkan nama mereka kedalam panel sebelah kiri. Ingat untuk menyimpan semua perubahan yang telah kamu buat atau nama grup .",
			group_members: "Anggota Grup",
			enter_group_title: "Masukkan nama grup...",
			loading: "Loading...",
			group_list: "Daftar Grup",
			type_here: "Tulis pesanmu disini",
			character_count: "Jumlah karakter: ",
			char_limit_exceeded: "pesanmu telah melewati batas 512 karakter.",
			send: "Submit",
			supervisors: {
				table_view: "Table view",
				send_bulk_messages: "Send bulk message",
				send_message_to_listed_accounts: "Send message to listed accounts",
				multiple_selection_with_ctrl: "You can choose multiple rank using with CTRL key",
				press_show_for_listing: "Click \"Show\" for listing",
				selected: "Selected",
				export_as_csv: "Export as CSV"
			}
		},
		profile: {
			give_stars_to_all_answers: "Berikan bintang pada semua jawabanmu",
			give_stars_and_add_thanks_to_all_answers: "Bintang dan terima kasih pada jawaban user",
			approve_all_answers: "Approve jawaban user",
			explaining_on_start: "Refresh halaman untuk mengulangi proses.",
			explaining_on_pause: "Kamu dapat melanjutkan dari yang kamu tinggalkan. Simpan interval pada setiap 25 penyelesaian.<br>Sebagai contoh, Jika kamu menunda pada 132, Kamu akan melanjutkan pada 125.",
			paused: "Paused",
			its_done: "Selesai",
			processed: "Proses",
			approving: "Approved",
			see_more_comment: "Tunjukkan lebih banyak komentar",
			delete_comments: "Menghapus komentar profil",
			how_many_comments_should_delete: "Berapa banyak komentar yang ingin kamu hapus?",
			how_many_comment_fetch: "Berapa banyak komentar yang ingin kamu tampilkan?",
			explaining_how_many: "Sebagai contoh,Jika kamu ingin mengambil tindakan dengan melihat lima puluh komentar, ketik 50.",
			do_you_want_to_delete_comments: "Apakah kamu yakin ingin menghapus komentar?",
			warning__no_turning_back: "Tidak ada pengembalian.",
			n_comments_deleted: "${n} Komentar telah dihapus",
			are_you_sure: "Kamu yakin?",
			yes: "Ya",
			no: "Tidak",
			delete_selected_comments: "Menghapus komentar yang dipilih",
			select_at_least_one_comment: "Kamu harus memilih setidaknya satu komentar",
			show_all_friends: {
				title: "Tampilkan semua",
				description: "Daftar teman",
				warning__no_friends_to_show: "Kamu tidak memiliki teman untuk ditampilkan"
			},
			remove_all_friends: "Remove all your friends",
			deleting_friends: {
				remove_all_friends: "Hapus semua teman",
				on_pause_message: "Kamu dapat melanjutkan dimana kamu berhenti",
				on_start_message: "Refresh halaman untuk mengulang proses.",
				delete_selected_friends: "Batalkan pertemanan yang dipilih",
				delete_selected_friends_title: "Kamu dapat membatalkan pertemanan dari teman yang kamu pilih.",
				select_at_least_one_friend: "Kamu harus memilih setidaknya satu teman",
				warning__are_you_sure_delete_selected_friends: "Aakah kamu yakin untuk membatalkan pertemanan dari teman yang kamu pilih?",
				warning__are_you_sure_delete_all_friends: "Apakah kamu yakin untuk menghapus semua temanmu?",
				n_deleted: "${n} seseorang dihapus dari daftar teman anda"
			},
			delete_account: {
				delete_reason: "Delete reason",
				evidences: "Evidences",
				cm_explain: "will send to the Community Manager",
				more_details: "More details..",
				add_files: "Add files",
				are_you_sure: "Kamu yakin untuk menghapus account?",
				file_size_limit_exceeded: "File size limit exceeded (250MB)",
				uploading: "Uploading",
				processing: "Processing",
				mail_sent: "Mail has been sent",
				upload_failed: "File(s) could not be upload",
				mail_failed: "Mail could not be sent",
				continue_deletion: "Do you still want to delete this account?(you'll have to report this progress by yourself)",
				lnk_file_warn: "The thing you are trying to add is not an actual file. Its a file shortcut.\nDo you still want to add it?"
			},
			rank_appended: "Rank appended to user",
			edit_users_profile: {
				title: "Edit user's profile",
				email: "E-Mail",
				nickname: "Nickname"
			},
			confirm_for_add_moderator: "Do you wanna add this account as a moderator?",
			moderator_privileges_added: "Account added as a moderator\nChanges will affect in 3 minutes"
		},
		user_content: {
			select: "Pilih",
			remove_answer: "Menghapus konten yang dipilih",
			select_a_question_first: "Pilih sebuah pertanyaan",
			select_an_answer_first: "Pilih sebuah jawaban",
			warning__reason_not_selected: "Alasan penghapusan belum ditentukan",
			warning__more_than_5_question_selected: "Lebih dari 5 pertanyaan dipilih.",
			warning__more_than_5_answer_selected: "Lebih dari 5 jawaban dipilih.",
			warning__continue_deleting: " Apakah kamu yakin untuk melanjutkan proses penghapusan?",
			approve_selected_answers: "Approve jawaban yang dipilih",
			unapprove_selected_answers: "Unapprove jawaban yang dipilih",
			remove_selected_answers: "Hapus jawaban yang dipilih",
			correction_for_selected_answers: "Meminta koreksi pada jawaban yang dpilih",
			warning__before_approving_review_the_answer_first: "Sebelum tindakan diambil, silahkan meninjau konten terlebih dahulu.",
			show_content: "Tampilkan konten user",
			range_of_listing: "Range number of content listing"
		},
		user_warnings: {
			operations: "Operasi",
			undo: "Batalkan",
			message__if_you_have_privileges: "Peringatan dicabut jika anda memiliki kewenangan."
		},
		delete_accounts: {
			delete_multiple_accounts: "Hapus beberapa akun",
			add_accounts_line_by_line: [
				"Kamu butuh untuk menempatkan garis akun dengan garis.",
				"Contoh;",
				"https://brainly.co.id/profil/aaa-1234567",
				"https://brainly.co.id/profil/bbb-2345678",
				"1234567",
				"2345678"
			],
			matched_accounts_number: "Akan dihapus:",
			deleted_accounts_number: "Hapus akun:",
			accounts_cannot_be_deleted_number: "Cannot delete:",
			already_deleted_accounts_number: "Already deleted:",
			delete_reason: "Alasan",
			delete: "Hapus !",
			are_you_sure: "Kamu yakin untuk menghapus?",
			button__delete_accounts: "Delete accounts!",
			error_during_deletion: "An error occurred while deleting the {nick} account"
		},
		moderating_functions: {
			compare_moderators_ip_address: {
				title: "Membandingkan IP address semua moderators",
				information: [
					"Ayo membuat sesuatu lebih jelas :)",
					"Moderator boleh jadi membagi password mereka dengan moderator lain atau mungkin yang terhubung lokasi internet dengan mereka atau mereka mungkin  <b>saudara kandung</b>"
				],
				moderators: "Moderator",
				matched_moderators: "Moderator identik",
				confirm__multiple_accounts_will_be_processed: "Too many accounts will be processed and it will take a while.\nDo you want to continue?"
			}
		},
		archive: {
			export: {
				title: "Export questions links as CSV",
				range_of_page_numbers: "Range of page numbers",
				scan: "Scan",
				processed_page_count: "Proccessed pages",
				elapsed_time: "Elapsed time",
				ranges_cannot_be_empty: "Ranges cannot be empty",
				wrong_ranges: "Ranges are not valid",
				csv_file_compatible_with_google_spreadsheet: "CSV file compatible with Google Spreadsheet"
			}
		},
		notifications: {
			x_send_you_a_new_message: "{x} send you a new message",
			new_notify: "New notification"
		}
	},
	rules: {
		question: {
			warnings: [],
			contents: {
				Default: {
					title: "Default",
					reason: "Pertanyaanmu sudah dihapus, karena melanggar Ketentuan Penggunaan. Oleh karena itu diharap lebih berhati hati untuk tidak mengulang kesalahan yang sama. Terima kasih dan Selamat Belajar.",
					code: 25
				},
				Link_web_Lain: {
					title: "Link web Lain",
					reason: "Mohon maaf pertanyaan kami hapus karena mengandung tautan ke halaman lain. Mohon untuk tidak mengulangi kesalahan yang sama supaya tidak diberi peringatan yang akan membuat akun anda dihapus/direstart. Terima kasih.",
					code: 27
				},
				Promosi: {
					title: "Promosi",
					reason: "Mohon maaf pertanyaan Anda dihapus karena memuat iklan/promosi. Mari kita jadikan Brainly sebagai tempat yang nyaman untuk belajar. Terima kasih",
					code: 27
				},
				Pertanyaan_tidak_wajar: {
					title: "Pertanyaan tidak wajar",
					reason: "Pertanyaan kami hapus karena pertanyaan yang diajukan tidak wajar. Mohon untuk tidak mengulangi kesalahan yang sama supaya tidak diberi peringatan yang akan membuat akun anda dihapus/direstart. Terima kasih.",
					code: 28
				},
				Terlalu_General: {
					title: "Terlalu General",
					reason: "Pertanyaan kami hapus karena pertanyaan yang diajukan terlalu general. Silakan ajukan pertanyaan yang lebih spesifik. Terima kasih.",
					code: 28
				},
				Bukan_pertanyaan_tapi_berkirim_pesan: {
					title: "Bukan pertanyaan, tapi berkirim pesan",
					reason: "Pertanyaan kami hapus karena pertanyaan yang diajukan bersifat menanyakan informasi seperti pesan. Kami sarankan untuk menggunakan halaman profil karena pertanyaan seperti ini sulit dievaluasi oleh moderator. Terima kasih.",
					code: 28
				},
				Terlalu_banyak_pertanyaan: {
					title: "Terlalu banyak pertanyaan",
					reason: "Maaf pertanyaan kamu dihapus karena terlalu banyak dan poin yang disertakan tidak setara dengan jumlah pertanyaan. Silahkan ajukan pertanyaan sesuai dengan jumlah poin (misalnya 5 poin untuk 1-2 pertanyaan), agar pertanyaan kamu segera terjawab. Selamat belajar :)",
					code: 28
				},
				Rangkuman_Kisi_kisi_Kunci_jawaban: {
					title: "Rangkuman/Kisi-kisi/Kunci jawaban",
					reason: "Di Brainly tidak diperkenankan meminta kisi-kisi/rangkuman/kunci jawaban termasuk bertanya saat ujian berlangsung. Terima kasih.",
					code: 28
				},
				Informasi_Pribadi: {
					title: "Informasi Pribadi",
					reason: "Hi, mohon maaf pertanyaanmu kami hapus karena berisi tentang informasi pribadi. Alangkah lebih baik jika informasi pribadi tidak diekspos di dunia maya. Terima kasih dan selamat belajar :)",
					code: 28
				},
				Tidak_berhubungan_dengan_pelajaran_sekolah: {
					title: "Tidak berhubungan dengan pelajaran sekolah",
					reason: "Hi, mari kita gunakan Brainly sebagai wadah murni belajar bersama. Untuk menyalurkan hobby Anda, silahkan kunjungi forum yang sesuai dan sudah banyak dikenal. Terima kasih :)",
					code: 28
				},
				Materi_Pertanyaan_tidak_lengkap: {
					title: "Materi Pertanyaan tidak lengkap",
					reason: "Poin kami kembalikan dan pertanyaan kami hapus dikarenakan materi yang ditanyakan tidak lengkap/Gambar tidak jelas. Mohon kirimkan ulang dengan lebih lengkap, sehingga user lain bisa menjawab pertanyaan Anda dengan jawaban terbaik. Terima kasih dan selamat belajar.",
					code: 29
				},
				Hanya_mencantumkan_nomor_halaman_buku: {
					title: "Hanya mencantumkan nomor halaman buku",
					reason: "Poin kami kembalikan dan pertanyaan kami hapus dikarenakan hanya mencantumkan nomor halaman buku. Mohon kirimkan ulang dengan lebih lengkap, sehingga user lain bisa menjawab pertanyaan Anda dengan jawaban terbaik. Terima kasih dan selamat belajar",
					code: 29
				},
				Mapel_keliru: {
					title: "Mapel keliru",
					reason: "Pertanyaan kami hapus namun poin anda kami kembalikan. Silahkan posting pertanyaan sesuai dengan mata pelajarannya ya. Semangat belajar!",
					code: 30
				},
				UN_only: {
					title: "UN only",
					reason: "Poin & pertanyaan kami kembalikan karena kolom ini dikhususkan hanya untuk materi Ujian Nasional atau Soal-soal Olimpiade. Silahkan menanyakan kembali pertanyaanmu ke mapel yang lebih relevan ya. Terima kasih.",
					code: 30
				},
				SBMPTN_Only: {
					title: "SBMPTN Only",
					reason: "Poin & pertanyaan kami kembalikan karena kolom ini dikhususkan hanya untuk materi Tes Masuk Perguruan Tinggi. Silahkan menanyakan kembali pertanyaanmu ke mapel yang lebih relevan ya. Terima kasih.",
					code: 30
				},
				Menjurus_Ke_SARA: {
					title: "Menjurus Ke SARA",
					reason: "Pertanyaan kami hapus karena mengandung unsur politis atau sentimen identitas, agama, ras, dan antar golongan. Mari kita jadikan Brainly sebagai sarana belajar dan membangun Indonesia melalui ilmu pengetahuan. Terima kasih.",
					code: 31
				}
			}
		},
		answer: {
			warnings: [],
			contents: {
				Default: {
					title: "Default",
					reason: "Jawabanmu sudah dihapus, karena melanggar Ketentuan Penggunaan. Oleh karena itu diharap lebih berhati hati untuk tidak mengulang kesalahan yang sama. Terima kasih dan Selamat Belajar.",
					code: 37
				},
				Lebih_ke_arah_Komentar: {
					title: "Lebih ke arah Komentar",
					reason: "Jawabanmu dihapus karena bersifat komentar dari pada jawaban. Jawaban di brainly harus genuine, jelas, dan dapat dipertanggungjawabkan. Terima kasih.",
					code: 38
				},
				Salinan_web_lain: {
					title: "Salinan web lain",
					reason: "Mohon menggunakan ide dan bahasa Anda sendiri dalam menjawab pertanyaan. Jawaban Anda kami hapus karena Anda menyalin dari web. BUKTI SUMBER: www.xxx.com",
					code: 39
				},
				Copas: {
					title: "Copas",
					reason: "Mohon menggunakan ide dan bahasa Anda sendiri dalam menjawab pertanyaan. Jawaban Anda kami hapus karena Anda menyalin dari jawaban pertama.",
					code: 39
				},
				copas_dari_apk: {
					title: "copas dari apk pembantu/berupa foto isi buku",
					reason: "Jawaban anda dihapus karena terbukti copas dengan screenshot hasil hitungan aplikasi/mengambil foto isi buku cetak secara langsung. Mohon menggunakan ide dan bahasa anda sendiri dalam menjawab pertanyaan",
					code: 39
				},
				Tidak_Relevan: {
					title: "Tidak Relevan",
					reason: "Jawaban Anda kami hapus karena tidak berhubungan dengan konteks pertanyaan. Terima kasih.",
					code: 40
				},
				Promosi_konten_pribadi: {
					title: "Promosi/konten pribadi",
					reason: "Mohon maaf jawaban Anda dihapus karena menyampaikan informasi lain di luar pembahasan soal yang ditanyakan. Mari kita jadikan Brainly sebagai tempat yang nyaman untuk belajar. Terima kasih.",
					code: 40
				},
				Belum_tepat_memberi_kesempatan_user_lain: {
					title: "Belum tepat/memberi kesempatan user lain",
					reason: "Terima kasih Anda sudah berusaha. Jawaban Anda kami hapus karena belum tepat dan untuk memberikan kesempatan kepada user lain, silakan mencoba lagi. Terima kasih.",
					code: 41
				},
				Tanpa_langkah_cara: {
					title: "Tanpa langkah cara",
					reason: "Terima kasih Anda sudah berusaha. Jawaban Anda kami hapus karena tidak memperlihatkan langkah pengerjaan ataupun uraian tertentu (khususnya untuk matematika, fisika, dan kimia). Silakan mencoba lagi. Terima kasih.",
					code: 41
				},
				Terlalu_General: {
					title: "Terlalu General",
					reason: "Maaf, jawaban yang diberikan terlalu umum. Gunakan kemampuan terbaik anda untuk menjelaskan secara rinci. Jawaban ini kami hapus agar user lain memiliki kesempatan yang sama. Terima kasih.",
					code: 41
				},
				Link_ke_web_lain: {
					title: "Link ke web lain",
					reason: "Jawaban kami hapus karena Anda hanya berkomentar dan mengarahkan ke web lain. Terima kasih dan Selamat Belajar",
					code: 42
				},
				Abusive: {
					title: "Abusive",
					reason: "Jawaban Anda kami hapus karena mengandung istilah dan maksud yang tidak pantas. Mari kita jadikan Brainly sebagai tempat yang nyaman untuk belajar. Terima kasih",
					code: 43
				},
				Bebas_Politik: {
					title: "Bebas Politik",
					reason: "Mohon maaf jawaban Anda kami hapus karena mengandung sentimen identitas, suku, agama, ras dan unsur politis. Jadikan Brainly sebagai sarana belajar dan membangun Indonesia melalui ilmu pengetahuan. Terima kasih",
					code: 43
				},
				Duplikasi_Jawaban: {
					title: "Duplikasi Jawaban",
					reason: "Kami selaku moderator memohon maaf atas kesalahan sistem yang terjadi. Di Brainly tiap user hanya memiliki hak untuk menjawab sekali dari tiap pertanyaan yang ada, sehingga untuk jawaban yang berulang akan kami hapus salah satu nya. Terima kasih dan selamat belajar.",
					code: 44
				}
			}
		},
		comment: {
			warnings: [],
			contents: {
				Default: {
					title: "Default",
					reason: "Komentarmu sudah dihapus, karena melanggar Ketentuan Penggunaan",
					code: 32
				},
				Konten_pribadi: {
					title: "Konten pribadi",
					reason: "Komentarmu dihapus karena memuat informasi pribadi. Terima kasih.",
					code: 35
				},
				Jawaban_di_Komentar: {
					title: "Jawaban di Komentar",
					reason: "Komentarmu dihapus karena memuat informasi yang tidak tepat. Terima kasih.",
					code: 36
				}
			}
		},
		account: [{
			title: "Melanggar ketentuan",
			reason: "Akunmu sudah dihapus, karena kami menemukan sejumlah pelanggaran Ketentuan Penggunaan"
		}, {
			title: "Tidak berniat berpartisipasi dalam belajar",
			reason: "Akun anda dihapus karena kami melihat anda tidak berniat berpartisipasi dalam belajar kelompok dan terlalu banyak melakukan abusive answer. Silahkan membuat akun baru apabila anda ingin belajar di brainly kembali. "
		}, {
			title: "Permintaan Pribadi",
			reason: "Akunmu dihapus karena permintaan pribadi / sendiri. Terima kasih atas pengalamannya bersama brainly dan sukses selalu."
		}]
	}
}