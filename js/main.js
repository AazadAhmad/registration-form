$(document).ready(function () {
  const $form = $("#progressiveForm");
  const $fields = $(".form-group");
  const $summary = $("#summary");
  const $buttons = $("#buttons");
  let current = 0;

  $fields.eq(current).addClass("active");

  function validate($input) {
    const val = $.trim($input.val());
    const name = $input.attr("name");
    const $group = $input.closest(".form-group");
    const $error = $group.find(".error");

    let isValid = true;
    if (name === "fullName" || name === "city") {
      isValid = val.length >= 3;
    } else if (name === "phone") {
      isValid = /^\d{10}$/.test(val);
    } else if (name === "email") {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    } else {
      isValid = val !== "";
    }

    if (!isValid) {
      $error.text(
        `Please enter a valid ${name.replace(/([A-Z])/g, " $1").toLowerCase()}`
      );
      $group.addClass("shake");
      setTimeout(() => $group.removeClass("shake"), 300);
    } else {
      $error.text("");
    }
    return isValid;
  }

  $form.on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const $input = $fields.eq(current).find("input");
      if (!validate($input)) return;
      $fields.eq(current).addClass("filled");
      if (current + 1 < $fields.length) {
        current++;
        $fields.eq(current).addClass("active").find("input").focus();
      } else {
        showSummary();
      }
    }
  });

  $fields.each(function (index) {
    $(this)
      .find("input")
      .on("input", function () {
        const $input = $(this);
        if (validate($input)) {
          $fields.eq(index).addClass("filled");
          if (index + 1 < $fields.length) {
            $fields.eq(index + 1).addClass("active");
          }
        } else {
          $fields.eq(index).removeClass("filled");
        }
      });
  });

  function showSummary() {
    $form.hide();
    $summary.empty().show();
    $buttons.show();
    $fields.each(function () {
      const $input = $(this).find("input");
      $summary.append(
        `<div class='read-only'><strong>${$input.attr(
          "placeholder"
        )}:</strong> <span>${$input.val()}</span></div>`
      );
    });
  }

  $("#editBtn").click(function () {
    $summary.hide();
    $form.show();
    $buttons.hide();
    $fields.addClass("active").removeClass("filled");
    current = $fields.length - 1;
    $fields.eq(current).find("input").focus();
  });

  $("#saveBtn").click(function () {
    showSummary();
  });
});
